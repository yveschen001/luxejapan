import { IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Currency {
  USDT = 'USDT',
  BTC = 'BTC',
  ETH = 'ETH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class CreatePaymentDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '支付金额' })
  @IsNumber()
  @Min(0.01)
  @Max(1000000)
  amount: number;

  @ApiProperty({ description: '支付货币', enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ description: '支付方式', required: false })
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: '支付描述', required: false })
  @IsString()
  description?: string;
} 