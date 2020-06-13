import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/db/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RefreshGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule, PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  providers: [
    AuthService, LocalStrategy, JwtStrategy,
    {provide: APP_GUARD, useClass: RefreshGuard},
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}