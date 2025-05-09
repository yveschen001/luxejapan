import { UserService } from './user.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('UserService', () => {
  let service: UserService
  let prisma: any
  let jwtService: any

  beforeEach(() => {
    prisma = {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      },
      userOAuthLink: {
        create: vi.fn()
      }
    }
    jwtService = {
      sign: vi.fn().mockReturnValue('token')
    }
    service = new UserService(prisma, jwtService)
  })

  it('應能註冊用戶', async () => {
    prisma.user.create.mockResolvedValue({ id: 1, username: 'test', password: 'hashed' })
    const result = await service.register('test', 'password123')
    expect(result).toHaveProperty('access_token', 'token')
    expect(prisma.user.create).toHaveBeenCalled()
  })

  it('應能登入用戶', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test', password: '$2b$10$...' })
    const result = await service.login('test', 'password123')
    expect(result).toHaveProperty('access_token', 'token')
    expect(prisma.user.findUnique).toHaveBeenCalled()
  })

  it('登入用戶不存在時應報錯', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    await expect(service.login('notfound', 'password')).rejects.toThrow('User not found')
  })

  it('應能查詢用戶資料', async () => {
    const mockUser = { id: 1, username: 'test', oauthLinks: [], kyc: {} }
    prisma.user.findUnique.mockResolvedValue(mockUser)
    const result = await service.getProfile(1)
    expect(result).toHaveProperty('username', 'test')
    expect(prisma.user.findUnique).toHaveBeenCalled()
  })

  it('應能更新用戶資料', async () => {
    prisma.user.update.mockResolvedValue({ id: 1, username: 'test', name: 'newName' })
    const result = await service.updateProfile(1, { name: 'newName' })
    expect(result).toHaveProperty('name', 'newName')
    expect(prisma.user.update).toHaveBeenCalled()
  })

  it('應能綁定 OAuth', async () => {
    prisma.userOAuthLink.create.mockResolvedValue({ id: 1, userId: 1, type: 'google', oauthId: 'token' })
    const result = await service.bindOAuth(1, 'google', 'token')
    expect(result).toHaveProperty('type', 'google')
    expect(prisma.userOAuthLink.create).toHaveBeenCalled()
  })
}) 