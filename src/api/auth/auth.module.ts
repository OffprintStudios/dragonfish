import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/db/users/users.module';
import { ImagesModule } from '../images/images.module';


@Module({
  imports: [
    UsersModule, ImagesModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'}, // 3 hours, temporary until problems with auth tokens fixed.
      }),
    }),
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController]
})
export class AuthModule {}
