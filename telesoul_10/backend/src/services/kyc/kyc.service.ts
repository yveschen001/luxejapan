import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class KycService {
  async findAll() {
    return prisma.kYC.findMany();
  }

  async findOne(id: number) {
    return prisma.kYC.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return prisma.kYC.create({
      data,
    });
  }

  // 用戶發起 KYC 申請
  async applyKyc(userId: number, provider: string) {
    // TODO: 建立 KYC 申請記錄，狀態 pending，調用第三方 KYC SDK
    return { success: true, status: 'pending' };
  }

  // 查詢用戶 KYC 狀態
  async getKycStatus(userId: number) {
    // TODO: 查詢 KYC 狀態，返回最新狀態
    return { status: 'pending' };
  }

  // 處理 KYC Webhook 回調
  async handleWebhook(body: any) {
    // TODO: 根據 webhook 內容更新 KYC 狀態，失敗重試，記錄審核日誌
    return { success: true };
  }
} 