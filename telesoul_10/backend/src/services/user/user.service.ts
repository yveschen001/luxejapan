import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return this.generateToken(user);
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('User not found');
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');
    
    return this.generateToken(user);
  }

  async bindOAuth(userId: number, type: string, oauth_token: string) {
    const oauthLink = await this.prisma.userOAuthLink.create({
      data: {
        userId,
        type,
        oauthId: oauth_token,
      },
    });
    return oauthLink;
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthLinks: true,
        kyc: true,
      },
    });
  }

  async updateProfile(userId: number, profile: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: profile,
    });
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 