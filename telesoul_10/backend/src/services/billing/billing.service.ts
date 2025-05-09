import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async startBilling(matchId: number, userId: number) {
    const startTime = new Date();
    await this.redis.set(`billing:${matchId}:${userId}:start`, startTime.toISOString());
    return startTime;
  }

  async endBilling(matchId: number, userId: number) {
    const startTimeStr = await this.redis.get(`billing:${matchId}:${userId}:start`);
    if (!startTimeStr) {
      throw new Error('Billing session not found');
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // 計算費用（示例：每秒 0.1 USDT）
    const amount = durationSeconds * 0.1;

    // 記錄計費事件
    await this.prisma.billingEvent.create({
      data: {
        matchId,
        userId,
        durationSeconds,
        amount,
        startTime,
        endTime,
      },
    });

    // 清理 Redis 中的計費信息
    await this.redis.del(`billing:${matchId}:${userId}:start`);

    return {
      durationSeconds,
      amount,
      startTime,
      endTime,
    };
  }

  async getBillingHistory(userId: number) {
    return this.prisma.billingEvent.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 10,
    });
  }

  async getTotalBilling(userId: number) {
    const result = await this.prisma.billingEvent.aggregate({
      where: { userId },
      _sum: {
        amount: true,
        durationSeconds: true,
      },
    });

    return {
      totalAmount: result._sum.amount || 0,
      totalDuration: result._sum.durationSeconds || 0,
    };
  }
} 