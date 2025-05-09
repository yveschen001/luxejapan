import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  // TODO: 用戶列表查詢
  getUsers() {
    return [];
  }

  // TODO: 通話/交易明細查詢
  getCalls() {
    return [];
  }

  // TODO: 提領審核
  approveWithdrawal(data: any) {
    return { success: true };
  }

  // TODO: KYC 批量審核
  batchApproveKyc(data: any) {
    return { success: true };
  }
} 