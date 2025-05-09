import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PaymentService {
  async findAll() {
    return prisma.payment.findMany();
  }

  async findOne(id: number) {
    return prisma.payment.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return prisma.payment.create({
      data,
    });
  }

  // 用戶發起 USDT 提領申請
  async applyWithdraw(userId: number, amount_usd: number) {
    // TODO: 驗證用戶餘額、寫入 withdrawals，狀態 pending
    // TODO: 返回申請結果與狀態
    return { success: true, status: 'pending' };
  }

  // 查詢用戶所有提領申請狀態
  async getWithdrawStatus(userId: number) {
    // TODO: 查詢 withdrawals 表，返回所有申請狀態
    return [
      // { id, amount_usd, status, created_at, updated_at }
    ];
  }

  // 系統自動審核 pending 提領
  async autoApprovePending() {
    // TODO: 查詢所有超時未審核的 pending，批量標記為 approved_by_system，寫入 withdrawal_audit_logs
    return { success: true, count: 0 };
  }
} 