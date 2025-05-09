import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class GatewayService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createSession(userId: string) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    return this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async validateSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
    });

    if (!session) return null;
    if (!session.isActive) return null;
    if (session.expiresAt < new Date()) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      return null;
    }

    return session;
  }

  async createApiKey(userId: string, name?: string) {
    const key = `tk_${uuidv4()}`;
    return this.prisma.apiKey.create({
      data: {
        userId,
        key,
        name,
      },
    });
  }

  async validateApiKey(key: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
    });

    if (!apiKey) return null;
    if (!apiKey.isActive) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      await this.prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { isActive: false },
      });
      return null;
    }

    return apiKey;
  }

  async recordMetrics(data: {
    userId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    duration: number;
  }) {
    return this.prisma.metrics.create({
      data,
    });
  }
}
