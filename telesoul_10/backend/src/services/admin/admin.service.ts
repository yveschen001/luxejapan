import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getUserList(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          createdAt: true,
          _count: {
            select: {
              matches: true,
              billingEvents: true,
              withdrawals: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getWithdrawalList(status?: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const where = status ? { status } : {};

    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawals.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.withdrawals.count({ where }),
    ]);

    return {
      withdrawals,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async approveWithdrawal(id: number, adminId: number) {
    const withdrawal = await this.prisma.withdrawals.update({
      where: { id },
      data: {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // 記錄審核日誌
    await this.prisma.withdrawalAuditLogs.create({
      data: {
        withdrawalId: id,
        action: 'approve',
        actor: `admin:${adminId}`,
      },
    });

    return withdrawal;
  }

  async rejectWithdrawal(id: number, adminId: number, reason: string) {
    const withdrawal = await this.prisma.withdrawals.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectedBy: adminId,
        rejectedAt: new Date(),
        rejectReason: reason,
      },
    });

    // 記錄審核日誌
    await this.prisma.withdrawalAuditLogs.create({
      data: {
        withdrawalId: id,
        action: 'reject',
        actor: `admin:${adminId}`,
        metadata: { reason },
      },
    });

    return withdrawal;
  }

  async getKYCList(status?: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const where = status ? { status } : {};

    const [kycRecords, total] = await Promise.all([
      this.prisma.userKyc.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.userKyc.count({ where }),
    ]);

    return {
      kycRecords,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getSystemMetrics() {
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));

    const [
      totalUsers,
      activeUsers,
      totalWithdrawals,
      pendingWithdrawals,
      totalKYC,
      pendingKYC,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          lastActiveAt: {
            gte: yesterday,
          },
        },
      }),
      this.prisma.withdrawals.count(),
      this.prisma.withdrawals.count({
        where: {
          status: 'pending',
        },
      }),
      this.prisma.userKyc.count(),
      this.prisma.userKyc.count({
        where: {
          status: 'pending',
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalWithdrawals,
      pendingWithdrawals,
      totalKYC,
      pendingKYC,
    };
  }
} 