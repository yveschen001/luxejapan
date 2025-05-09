import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReportingService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Cron('0 0 16 * * *') // 每天 UTC 16:00 (台北 0:00)
  async generateDailySnapshot() {
    const date = new Date();
    const yesterday = new Date(date.setDate(date.getDate() - 1));
    const dateStr = yesterday.toISOString().split('T')[0];

    // 收集各項指標
    const metrics = await this.collectDailyMetrics(yesterday);

    // 生成快照
    const snapshot = await this.prisma.dailySnapshot.create({
      data: {
        date: dateStr,
        payload: metrics,
      },
    });

    // 緩存快照
    await this.redis.set(
      `snapshot:${dateStr}`,
      JSON.stringify(snapshot),
      60 * 60 * 24 * 7 // 緩存 7 天
    );

    return snapshot;
  }

  private async collectDailyMetrics(date: Date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // 收集用戶活躍度
    const activeUsers = await this.prisma.user.count({
      where: {
        lastActiveAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // 收集通話數據
    const callStats = await this.prisma.billingEvent.aggregate({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        durationSeconds: true,
        amount: true,
      },
      _count: true,
    });

    // 收集提領數據
    const withdrawalStats = await this.prisma.withdrawal.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    return {
      activeUsers,
      callStats: {
        totalDuration: callStats._sum.durationSeconds || 0,
        totalAmount: callStats._sum.amount || 0,
        totalCalls: callStats._count || 0,
      },
      withdrawalStats: {
        totalAmount: withdrawalStats._sum.amount || 0,
        totalCount: withdrawalStats._count || 0,
      },
    };
  }

  async getSnapshot(date: string) {
    // 先查緩存
    const cached = await this.redis.get(`snapshot:${date}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // 查數據庫
    const snapshot = await this.prisma.dailySnapshot.findUnique({
      where: { date },
    });

    if (snapshot) {
      // 更新緩存
      await this.redis.set(
        `snapshot:${date}`,
        JSON.stringify(snapshot),
        60 * 60 * 24 * 7
      );
    }

    return snapshot;
  }

  async getMetricsSummary(startDate: string, endDate: string) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return snapshots.map(snapshot => ({
      date: snapshot.date,
      metrics: snapshot.payload,
    }));
  }
} 