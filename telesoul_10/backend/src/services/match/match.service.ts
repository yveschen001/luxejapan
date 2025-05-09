import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findMatch(userId: number) {
    // 檢查用戶是否已在匹配隊列中
    const existingMatch = await this.redis.get(`match:${userId}`);
    if (existingMatch) {
      return JSON.parse(existingMatch);
    }

    // 將用戶加入匹配隊列
    await this.redis.lpush('match_queue', userId.toString());
    
    // 嘗試匹配
    const queueLength = await this.redis.llen('match_queue');
    if (queueLength >= 2) {
      const [userA, userB] = await this.redis.lrange('match_queue', 0, 1);
      await this.redis.ltrim('match_queue', 2, -1);

      const roomId = uuidv4();
      const match = await this.prisma.match.create({
        data: {
          userA: parseInt(userA),
          userB: parseInt(userB),
          roomId,
        },
      });

      // 通知雙方匹配成功
      await this.redis.set(`match:${userA}`, JSON.stringify({ roomId, matchId: match.id }));
      await this.redis.set(`match:${userB}`, JSON.stringify({ roomId, matchId: match.id }));

      return { roomId, matchId: match.id };
    }

    return null;
  }

  async endMatch(roomId: string) {
    const match = await this.prisma.match.findUnique({
      where: { roomId },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // 清理 Redis 中的匹配信息
    await this.redis.del(`match:${match.userA}`);
    await this.redis.del(`match:${match.userB}`);

    // 更新匹配狀態
    return this.prisma.match.update({
      where: { id: match.id },
      data: { endedAt: new Date() },
    });
  }

  async getMatchHistory(userId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [
          { userA: userId },
          { userB: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }
} 