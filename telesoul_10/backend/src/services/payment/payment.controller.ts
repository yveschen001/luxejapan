import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Post()
  create(@Body() createPaymentDto: any) {
    return this.paymentService.create(createPaymentDto);
  }

  // 用戶發起 USDT 提領申請
  @Post('apply')
  async applyWithdraw(@Body() body: { userId: number; amount_usd: number }) {
    return this.paymentService.applyWithdraw(body.userId, body.amount_usd);
  }

  // 查詢用戶所有提領申請狀態
  @Get('status')
  async getWithdrawStatus(@Req() req: any) {
    // 假設 userId 來自 JWT 或查詢參數
    const userId = req.user?.id || req.query.userId;
    return this.paymentService.getWithdrawStatus(userId);
  }

  // 系統自動審核（批量將超時未審核的 pending 標記為 approved_by_system）
  @Post('auto-approve')
  async autoApprove() {
    return this.paymentService.autoApprovePending();
  }
} 