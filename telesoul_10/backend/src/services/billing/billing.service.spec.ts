import { BillingService } from './billing.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('BillingService', () => {
  let service: BillingService
  let prisma: any
  let redis: any

  beforeEach(() => {
    prisma = {
      billingEvent: {
        create: vi.fn(),
        findMany: vi.fn(),
        aggregate: vi.fn(),
        findUnique: vi.fn()
      },
      callCharges: {
        create: vi.fn(),
        findMany: vi.fn(),
        aggregate: vi.fn()
      }
    }
    redis = {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
      exists: vi.fn()
    }
    service = new BillingService(prisma, redis)
  })

  it('應能開始計費', async () => {
    redis.set.mockResolvedValue('OK')
    const result = await service.startBilling(1, 2)
    expect(result).toBeInstanceOf(Date)
    expect(redis.set).toHaveBeenCalled()
  })

  it('應能結束計費並計算費用', async () => {
    const startTime = new Date(Date.now() - 3600000) // 1小時前
    redis.get.mockResolvedValue(startTime.toISOString())
    redis.del.mockResolvedValue(1)
    prisma.billingEvent.create.mockResolvedValue({ id: 1 })
    prisma.callCharges.create.mockResolvedValue({ id: 1, amount: 10 })

    const result = await service.endBilling(1, 2)
    expect(result).toHaveProperty('durationSeconds', 3600)
    expect(result).toHaveProperty('amount')
    expect(prisma.billingEvent.create).toHaveBeenCalled()
    expect(prisma.callCharges.create).toHaveBeenCalled()
  })

  it('應能處理計費異常情況', async () => {
    redis.get.mockResolvedValue(null)
    await expect(service.endBilling(1, 2)).rejects.toThrow('未找到計費記錄')
  })

  it('應能查詢計費歷史', async () => {
    const mockHistory = [
      { id: 1, amount: 10, durationSeconds: 3600 },
      { id: 2, amount: 20, durationSeconds: 7200 }
    ]
    prisma.billingEvent.findMany.mockResolvedValue(mockHistory)
    
    const result = await service.getBillingHistory(2)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('amount', 10)
  })

  it('應能查詢總計費', async () => {
    prisma.billingEvent.aggregate.mockResolvedValue({
      _sum: { amount: 100, durationSeconds: 36000 }
    })
    
    const result = await service.getTotalBilling(2)
    expect(result).toHaveProperty('totalAmount', 100)
    expect(result).toHaveProperty('totalDuration', 36000)
  })

  it('應能處理重複計費', async () => {
    redis.exists.mockResolvedValue(1)
    await expect(service.startBilling(1, 2)).rejects.toThrow('已有進行中的計費')
  })

  it('應能驗證計費權限', async () => {
    await expect(service.startBilling(0, 2)).rejects.toThrow('無效的用戶ID')
    await expect(service.startBilling(1, 0)).rejects.toThrow('無效的房間ID')
  })
}) 