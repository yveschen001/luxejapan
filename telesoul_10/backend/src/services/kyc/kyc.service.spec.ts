import { KycService } from './kyc.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('KycService', () => {
  let service: KycService

  beforeEach(() => {
    service = new KycService()
  })

  it('應能發起 KYC 申請', async () => {
    const result = await service.applyKyc(1, 'sumsub')
    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('status', 'pending')
  })

  it('應能查詢 KYC 狀態', async () => {
    const result = await service.getKycStatus(1)
    expect(result).toHaveProperty('status', 'pending')
  })

  it('應能處理 KYC Webhook', async () => {
    const result = await service.handleWebhook({ userId: 1, status: 'approved' })
    expect(result).toHaveProperty('success', true)
  })
}) 