import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('calls')
  getCalls() {
    return this.adminService.getCalls();
  }

  @Post('withdrawals/approve')
  approveWithdrawal(@Body() body: any) {
    return this.adminService.approveWithdrawal(body);
  }

  @Post('kyc/batch-approve')
  batchApproveKyc(@Body() body: any) {
    return this.adminService.batchApproveKyc(body);
  }
} 