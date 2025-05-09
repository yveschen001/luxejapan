import { HttpException, HttpStatus } from '@nestjs/common';

export class KycNotFoundException extends HttpException {
  constructor(kycId: string) {
    super(`KYC 记录 ${kycId} 未找到`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidKycStatusException extends HttpException {
  constructor(status: string) {
    super(`无效的 KYC 状态: ${status}`, HttpStatus.BAD_REQUEST);
  }
}

export class DocumentValidationFailedException extends HttpException {
  constructor(reason: string) {
    super(`证件验证失败: ${reason}`, HttpStatus.BAD_REQUEST);
  }
}

export class KycAlreadyExistsException extends HttpException {
  constructor(userId: string) {
    super(`用户 ${userId} 已有 KYC 记录`, HttpStatus.CONFLICT);
  }
}

export class KycVerificationFailedException extends HttpException {
  constructor(reason: string) {
    super(`KYC 验证失败: ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class KycExpiredException extends HttpException {
  constructor(kycId: string) {
    super(`KYC 记录 ${kycId} 已过期`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidDocumentTypeException extends HttpException {
  constructor(type: string) {
    super(`无效的证件类型: ${type}`, HttpStatus.BAD_REQUEST);
  }
}

export class DocumentImageInvalidException extends HttpException {
  constructor(reason: string) {
    super(`证件照片无效: ${reason}`, HttpStatus.BAD_REQUEST);
  }
} 