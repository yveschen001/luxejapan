import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchNotFoundException extends HttpException {
  constructor(matchId: string) {
    super(`匹配 ${matchId} 未找到`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidMatchStatusException extends HttpException {
  constructor(status: string) {
    super(`无效的匹配状态: ${status}`, HttpStatus.BAD_REQUEST);
  }
}

export class MatchAlreadyExistsException extends HttpException {
  constructor(userId: string) {
    super(`用户 ${userId} 已有进行中的匹配`, HttpStatus.CONFLICT);
  }
}

export class MatchCreationFailedException extends HttpException {
  constructor(reason: string) {
    super(`创建匹配失败: ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class MatchUpdateFailedException extends HttpException {
  constructor(matchId: string, reason: string) {
    super(`更新匹配 ${matchId} 失败: ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
} 