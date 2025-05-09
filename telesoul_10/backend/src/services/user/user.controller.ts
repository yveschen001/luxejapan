import { Controller, Post, Get, Body, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.userService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.userService.login(body.username, body.password);
  }

  @Post('bind')
  async bindOAuth(@Body() body: { userId: number; type: string; oauth_token: string }) {
    return this.userService.bindOAuth(body.userId, body.type, body.oauth_token);
  }

  @Get('profile')
  async getProfile(@Query('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(@Body() body: { userId: number; profile: any }) {
    return this.userService.updateProfile(body.userId, body.profile);
  }
} 