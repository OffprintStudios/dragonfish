import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/mongo/users/users.module';
import { AuthGuard } from './auth.guard';

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
  ],
  controllers: [AuthController]
})
export class AuthModule {}
