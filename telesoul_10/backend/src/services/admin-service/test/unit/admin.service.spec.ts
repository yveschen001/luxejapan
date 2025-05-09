import { AdminService } from '../../src/services/admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    service = new AdminService();
  });

  it('should return users array', () => {
    expect(service.getUsers()).toEqual([]);
  });

  it('should return calls array', () => {
    expect(service.getCalls()).toEqual([]);
  });

  it('should approve withdrawal', () => {
    expect(service.approveWithdrawal({ withdrawalId: 1, approvedBy: 'admin' })).toEqual({ success: true });
  });

  it('should batch approve KYC', () => {
    expect(service.batchApproveKyc({ kycIds: [1, 2], approvedBy: 'admin' })).toEqual({ success: true });
  });
}); 