import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GatewayService {
  constructor(
    private redis: RedisService,
    private jwtService: JwtService,
  ) {}

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const blacklisted = await this.redis.get(`blacklist:${token}`);
      return !blacklisted;
    } catch {
      return false;
    }
  }

  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    await this.redis.set(`blacklist:${token}`, '1', expiresIn);
  }

  async rateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await this.redis.incr(`ratelimit:${key}`);
    if (current === 1) {
      await this.redis.expire(`ratelimit:${key}`, window);
    }
    return current <= limit;
  }

  async getServiceHealth(): Promise<Record<string, boolean>> {
    const services = [
      'user-service',
      'match-service',
      'billing-service',
      'reporting-service',
      'admin-service',
      'payment-service',
      'kyc-service',
    ];

    const healthChecks = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(`${process.env[`${service.toUpperCase()}_URL`]}/health`);
          return [service, response.ok];
        } catch {
          return [service, false];
        }
      }),
    );

    return Object.fromEntries(healthChecks);
  }

  async getServiceMetrics(): Promise<Record<string, any>> {
    const services = [
      'user-service',
      'match-service',
      'billing-service',
      'reporting-service',
      'admin-service',
      'payment-service',
      'kyc-service',
    ];

    const metrics = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(`${process.env[`${service.toUpperCase()}_URL`]}/metrics`);
          const data = await response.json();
          return [service, data];
        } catch {
          return [service, null];
        }
      }),
    );

    return Object.fromEntries(metrics);
  }

  async getServiceLogs(service: string, level: string = 'error', limit: number = 100): Promise<any[]> {
    const key = `logs:${service}:${level}`;
    const logs = await this.redis.lrange(key, 0, limit - 1);
    return logs.map((log) => JSON.parse(log));
  }

  async addServiceLog(service: string, level: string, message: string, metadata: any = {}): Promise<void> {
    const key = `logs:${service}:${level}`;
    const log = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    });
    await this.redis.lpush(key, log);
    await this.redis.ltrim(key, 0, 999); // 保留最近 1000 條日誌
  }
} 