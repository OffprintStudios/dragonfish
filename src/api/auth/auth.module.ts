import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/db/users/users.module';
import { AuthGuard } from './auth.guard';
import { RefreshGuard } from './refresh.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'},
      }),
    }),
  ],
  providers: [
    AuthService,
    {provide: APP_GUARD, useClass: AuthGuard},
    {provide: APP_GUARD, useClass: RefreshGuard},
  ],
  controllers: [AuthController]
})
export class AuthModule {}
