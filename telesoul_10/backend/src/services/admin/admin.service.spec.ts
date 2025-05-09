import { AdminService } from './admin.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('AdminService', () => {
  let service: AdminService
  let prisma: any
  let redis: any

  beforeEach(() => {
    prisma = {
      user: { findMany: vi.fn(), count: vi.fn() },
      withdrawals: { findMany: vi.fn(), count: vi.fn(), update: vi.fn() },
      withdrawalAuditLogs: { create: vi.fn() },
      userKyc: { findMany: vi.fn(), count: vi.fn() }
    }
    redis = {}
    service = new AdminService(prisma, redis)
  })

  it('應能查詢用戶列表', async () => {
    prisma.user.findMany.mockResolvedValue([])
    prisma.user.count.mockResolvedValue(0)
    const result = await service.getUserList(1, 10)
    expect(result).toHaveProperty('users')
    expect(result).toHaveProperty('total')
  })

  it('應能查詢提領列表', async () => {
    prisma.withdrawals.findMany.mockResolvedValue([])
    prisma.withdrawals.count.mockResolvedValue(0)
    const result = await service.getWithdrawalList('pending', 1, 10)
    expect(result).toHaveProperty('withdrawals')
    expect(result).toHaveProperty('total')
  })

  it('應能審核提領', async () => {
    prisma.withdrawals.update.mockResolvedValue({})
    prisma.withdrawalAuditLogs.create.mockResolvedValue({})
    const result = await service.approveWithdrawal(1, 2)
    expect(result).toBeDefined()
    expect(prisma.withdrawals.update).toHaveBeenCalled()
    expect(prisma.withdrawalAuditLogs.create).toHaveBeenCalled()
  })

  it('應能駁回提領', async () => {
    prisma.withdrawals.update.mockResolvedValue({})
    prisma.withdrawalAuditLogs.create.mockResolvedValue({})
    const result = await service.rejectWithdrawal(1, 2, 'reason')
    expect(result).toBeDefined()
    expect(prisma.withdrawals.update).toHaveBeenCalled()
    expect(prisma.withdrawalAuditLogs.create).toHaveBeenCalled()
  })

  it('應能查詢 KYC 列表', async () => {
    prisma.userKyc.findMany.mockResolvedValue([])
    prisma.userKyc.count.mockResolvedValue(0)
    const result = await service.getKYCList('pending', 1, 10)
    expect(result).toHaveProperty('kycRecords')
    expect(result).toHaveProperty('total')
  })

  it('應能查詢系統指標', async () => {
    prisma.user.count.mockResolvedValue(1)
    prisma.withdrawals.count.mockResolvedValue(1)
    prisma.userKyc.count.mockResolvedValue(1)
    const result = await service.getSystemMetrics()
    expect(result).toHaveProperty('totalUsers')
    expect(result).toHaveProperty('activeUsers')
  })
}) 