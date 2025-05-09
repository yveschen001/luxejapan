import { MatchService } from './match.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('MatchService', () => {
  let service: MatchService
  let prisma: any
  let redis: any

  beforeEach(() => {
    prisma = {
      match: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      }
    }
    redis = {
      get: vi.fn(),
      lpush: vi.fn(),
      llen: vi.fn(),
      lrange: vi.fn(),
      ltrim: vi.fn(),
      set: vi.fn(),
      del: vi.fn()
    }
    service = new MatchService(prisma, redis)
  })

  it('應能成功匹配用戶', async () => {
    redis.get.mockResolvedValue(null)
    redis.lpush.mockResolvedValue(1)
    redis.llen.mockResolvedValue(2)
    redis.lrange.mockResolvedValue(['1', '2'])
    redis.ltrim.mockResolvedValue('OK')
    prisma.match.create.mockResolvedValue({ id: 1, userA: 1, userB: 2, roomId: 'room-123' })
    redis.set.mockResolvedValue('OK')

    const result = await service.findMatch(1)
    expect(result).toHaveProperty('roomId')
    expect(result).toHaveProperty('matchId')
    expect(prisma.match.create).toHaveBeenCalled()
  })

  it('應能返回已存在的匹配', async () => {
    redis.get.mockResolvedValue(JSON.stringify({ roomId: 'room-123', matchId: 1 }))
    const result = await service.findMatch(1)
    expect(result).toHaveProperty('roomId', 'room-123')
    expect(result).toHaveProperty('matchId', 1)
  })

  it('應能處理無可用匹配的情況', async () => {
    redis.get.mockResolvedValue(null)
    redis.lpush.mockResolvedValue(1)
    redis.llen.mockResolvedValue(1)
    const result = await service.findMatch(1)
    expect(result).toBeNull()
  })

  it('應能結束匹配', async () => {
    prisma.match.findUnique.mockResolvedValue({ id: 1, userA: 1, userB: 2, roomId: 'room-123' })
    redis.del.mockResolvedValue('OK')
    prisma.match.update.mockResolvedValue({ id: 1, endedAt: new Date() })
    const result = await service.endMatch('room-123')
    expect(result).toHaveProperty('endedAt')
    expect(prisma.match.update).toHaveBeenCalled()
  })

  it('應能查詢用戶匹配歷史', async () => {
    const mockHistory = [
      { id: 1, roomId: 'room-1', userA: 1, userB: 2 },
      { id: 2, roomId: 'room-2', userA: 1, userB: 3 }
    ]
    prisma.match.findMany.mockResolvedValue(mockHistory)
    const result = await service.getMatchHistory(1)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('roomId', 'room-1')
  })
}) 