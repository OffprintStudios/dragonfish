import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services';
import { AccountForm, Login } from '$shared/models/accounts';
import { Request, Response } from 'express';
import { LoginPackage } from '$shared/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Req() req: Request, @Body() formInfo: AccountForm): Promise<LoginPackage> {
    return await this.auth.register(req, formInfo);
  }

  @Post('login')
  async login(@Req() req: Request, @Body() login: Login): Promise<LoginPackage> {
    return await this.auth.login(req, login);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    return await this.auth.logout(req, res);
  }
}
