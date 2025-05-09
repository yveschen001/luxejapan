import { PaymentService } from './payment.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('PaymentService', () => {
  let service: PaymentService
  let prisma: any
  let redis: any

  beforeEach(() => {
    prisma = {
      payment: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn()
      },
      user: {
        findUnique: vi.fn(),
        update: vi.fn()
      }
    }
    redis = {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
      exists: vi.fn()
    }
    service = new PaymentService(prisma, redis)
  })

  it('應能創建支付訂單', async () => {
    const mockPayment = {
      userId: 1,
      amount: 100,
      type: 'deposit',
      method: 'credit_card'
    }
    prisma.payment.create.mockResolvedValue({ id: 1, ...mockPayment, status: 'pending' })
    
    const result = await service.createPayment(mockPayment)
    expect(result).toHaveProperty('status', 'pending')
    expect(result).toHaveProperty('amount', 100)
    expect(prisma.payment.create).toHaveBeenCalled()
  })

  it('應能處理支付成功', async () => {
    const mockPayment = {
      id: 1,
      userId: 1,
      amount: 100,
      status: 'pending'
    }
    prisma.payment.findUnique.mockResolvedValue(mockPayment)
    prisma.payment.update.mockResolvedValue({ ...mockPayment, status: 'completed' })
    prisma.user.update.mockResolvedValue({ id: 1, balance: 100 })
    
    const result = await service.handlePaymentSuccess(1)
    expect(result).toHaveProperty('status', 'completed')
    expect(prisma.user.update).toHaveBeenCalled()
  })

  it('應能處理支付失敗', async () => {
    const mockPayment = {
      id: 1,
      userId: 1,
      amount: 100,
      status: 'pending'
    }
    prisma.payment.findUnique.mockResolvedValue(mockPayment)
    prisma.payment.update.mockResolvedValue({ ...mockPayment, status: 'failed' })
    
    const result = await service.handlePaymentFailure(1, '餘額不足')
    expect(result).toHaveProperty('status', 'failed')
    expect(result).toHaveProperty('failReason', '餘額不足')
  })

  it('應能查詢支付記錄', async () => {
    const mockPayments = [
      { id: 1, amount: 100, status: 'completed' },
      { id: 2, amount: 200, status: 'completed' }
    ]
    prisma.payment.findMany.mockResolvedValue(mockPayments)
    
    const result = await service.getPaymentHistory(1)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('amount', 100)
  })

  it('應能處理支付不存在的情況', async () => {
    prisma.payment.findUnique.mockResolvedValue(null)
    await expect(service.handlePaymentSuccess(999)).rejects.toThrow('支付記錄不存在')
  })

  it('應能驗證支付權限', async () => {
    await expect(service.createPayment({ userId: 0, amount: 100 }))
      .rejects.toThrow('無效的用戶ID')
  })

  it('應能處理重複支付', async () => {
    prisma.payment.findUnique.mockResolvedValue({ id: 1, status: 'completed' })
    await expect(service.handlePaymentSuccess(1))
      .rejects.toThrow('支付已完成')
  })
}) 