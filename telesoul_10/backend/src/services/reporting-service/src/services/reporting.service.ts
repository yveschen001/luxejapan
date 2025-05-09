import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportingService {
  // TODO: 日報表查詢
  getDailyMetrics(date: string, agentId?: string) {
    return {};
  }

  // TODO: 快照查詢
  getSnapshot(date: string, format?: string) {
    return {};
  }

  // TODO: 提領統計
  getWithdrawalsSummary(from: string, to: string) {
    return {};
  }

  // TODO: 排行榜查詢
  getLeaderboard(type: string, date: string, topN: number) {
    return [];
  }
} 