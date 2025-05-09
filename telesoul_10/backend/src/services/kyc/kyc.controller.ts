import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { KycService } from './kyc.service';

@Controller('api/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  findAll() {
    return this.kycService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kycService.findOne(+id);
  }

  @Post('apply')
  async applyKyc(@Body() body: { userId: number; provider: string }) {
    return this.kycService.applyKyc(body.userId, body.provider);
  }

  @Get('status')
  async getKycStatus(@Query('userId') userId: number) {
    return this.kycService.getKycStatus(userId);
  }

  @Post('webhook')
  async kycWebhook(@Body() body: any) {
    return this.kycService.handleWebhook(body);
  }
} 