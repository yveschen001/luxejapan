export class GetUsersDto {
  // TODO: 定義用戶查詢參數
}

export class ApproveWithdrawalDto {
  withdrawalId: number;
  approvedBy: string;
}

export class BatchApproveKycDto {
  kycIds: number[];
  approvedBy: string;
} 