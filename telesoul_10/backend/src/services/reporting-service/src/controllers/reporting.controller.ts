import { Controller, Get, Query, Param } from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  // TODO: 日報表查詢
  @Get('metrics/daily')
  getDailyMetrics(@Query('date') date: string, @Query('agentId') agentId?: string) {
    return this.reportingService.getDailyMetrics(date, agentId);
  }

  // TODO: 快照查詢
  @Get('snapshot/:date')
  getSnapshot(@Param('date') date: string, @Query('format') format?: string) {
    return this.reportingService.getSnapshot(date, format);
  }

  // TODO: 提領統計
  @Get('withdrawals/summary')
  getWithdrawalsSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.reportingService.getWithdrawalsSummary(from, to);
  }

  // TODO: 排行榜查詢
  @Get('leaderboard')
  getLeaderboard(@Query('type') type: string, @Query('date') date: string, @Query('topN') topN: number) {
    return this.reportingService.getLeaderboard(type, date, topN);
  }
} 