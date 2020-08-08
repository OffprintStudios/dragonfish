import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ContribService } from './contrib.service';
import { WorksModule } from '../../db/works/works.module';
import { UsersModule } from '../../db/users/users.module';
import { ContribController } from './contrib.controller';
import { ApprovalQueueModule } from 'src/db/approval-queue/approval-queue.module';
import { getJwtSecretKey, JWT_EXPIRATION } from 'src/util';

@Module({
  imports: [
    UsersModule,
    WorksModule,
    ApprovalQueueModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  providers: [ContribService],
  controllers: [ContribController]
})
export class ContribModule {}
