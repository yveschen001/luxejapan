import { ReportingService } from './reporting.service'

describe('ReportingService', () => {
  let service: ReportingService
  let prisma: any
  let redis: any

  beforeEach(() => {
    prisma = {
      dailySnapshot: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn()
      },
      user: { count: jest.fn() },
      billingEvent: { aggregate: jest.fn() },
      withdrawal: { aggregate: jest.fn() }
    }
    redis = {
      set: jest.fn(),
      get: jest.fn()
    }
    service = new ReportingService(prisma, redis)
  })

  it('應能生成每日快照', async () => {
    prisma.dailySnapshot.create.mockResolvedValue({ id: 1, date: '2024-01-01', payload: {} })
    redis.set.mockResolvedValue(undefined)
    const result = await service.generateDailySnapshot()
    expect(result).toHaveProperty('id')
    expect(redis.set).toHaveBeenCalled()
  })

  it('應能查詢快照', async () => {
    redis.get.mockResolvedValue(null)
    prisma.dailySnapshot.findUnique.mockResolvedValue({ id: 1, date: '2024-01-01', payload: {} })
    const result = await service.getSnapshot('2024-01-01')
    expect(result).toHaveProperty('id')
  })

  it('應能查詢指標彙總', async () => {
    prisma.dailySnapshot.findMany.mockResolvedValue([{ date: '2024-01-01', payload: {} }])
    const result = await service.getMetricsSummary('2024-01-01', '2024-01-02')
    expect(Array.isArray(result)).toBe(true)
  })
}) 