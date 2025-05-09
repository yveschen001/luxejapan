import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentNotFoundException extends HttpException {
  constructor(paymentId: string) {
    super(`支付 ${paymentId} 未找到`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidPaymentStatusException extends HttpException {
  constructor(status: string) {
    super(`无效的支付状态: ${status}`, HttpStatus.BAD_REQUEST);
  }
}

export class PaymentAmountInvalidException extends HttpException {
  constructor(amount: number) {
    super(`无效的支付金额: ${amount}`, HttpStatus.BAD_REQUEST);
  }
}

export class PaymentCurrencyNotSupportedException extends HttpException {
  constructor(currency: string) {
    super(`不支持的支付货币: ${currency}`, HttpStatus.BAD_REQUEST);
  }
}

export class PaymentProcessingFailedException extends HttpException {
  constructor(reason: string) {
    super(`支付处理失败: ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class PaymentRefundFailedException extends HttpException {
  constructor(paymentId: string, reason: string) {
    super(`支付 ${paymentId} 退款失败: ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InsufficientBalanceException extends HttpException {
  constructor(userId: string) {
    super(`用户 ${userId} 余额不足`, HttpStatus.BAD_REQUEST);
  }
}

export class PaymentMethodNotSupportedException extends HttpException {
  constructor(method: string) {
    super(`不支持的支付方式: ${method}`, HttpStatus.BAD_REQUEST);
  }
} 