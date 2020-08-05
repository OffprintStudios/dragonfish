import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ContribService } from './contrib.service';
import { WorksModule } from '../../db/works/works.module';
import { UsersModule } from '../../db/users/users.module';
import { ContribController } from './contrib.controller';

@Module({
  imports: [
    UsersModule,
    WorksModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'},
      }),
    }),
  ],
  providers: [ContribService],
  controllers: [ContribController]
})
export class ContribModule {}
