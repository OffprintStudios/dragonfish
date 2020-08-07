import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ContribService } from './contrib.service';
import { WorksModule } from '../../db/works/works.module';
import { UsersModule } from '../../db/users/users.module';
import { ContribController } from './contrib.controller';
import { ApprovalQueueModule } from 'src/db/approval-queue/approval-queue.module';

@Module({
  imports: [
    UsersModule,
    WorksModule,
    ApprovalQueueModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '10800s'}, // 3 hours, temporary until problems with auth tokens fixed.
      }),
    }),
  ],
  providers: [ContribService],
  controllers: [ContribController]
})
export class ContribModule {}
