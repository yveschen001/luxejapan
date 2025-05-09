import { ReportingService } from '../../src/services/reporting.service';

describe('ReportingService', () => {
  let service: ReportingService;

  beforeEach(() => {
    service = new ReportingService();
  });

  it('should return daily metrics', () => {
    expect(service.getDailyMetrics('2024-01-01')).toEqual({});
  });

  it('should return snapshot', () => {
    expect(service.getSnapshot('2024-01-01', 'json')).toEqual({});
  });

  it('should return withdrawals summary', () => {
    expect(service.getWithdrawalsSummary('2024-01-01', '2024-01-31')).toEqual({});
  });

  it('should return leaderboard', () => {
    expect(service.getLeaderboard('diamonds', '2024-01-01', 10)).toEqual([]);
  });
}); 