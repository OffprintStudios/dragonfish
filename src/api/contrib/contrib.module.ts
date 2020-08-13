import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ContribService } from './contrib.service';
import { WorksModule } from '../../db/works/works.module';
import { UsersModule } from '../../db/users/users.module';
import { ContribController } from './contrib.controller';
import { ApprovalQueueModule } from 'src/db/approval-queue/approval-queue.module';
import { getJwtSecretKey, JWT_EXPIRATION } from 'src/util';
import { DocsController } from './docs/docs.controller';
import { DocsModule } from 'src/db/docs/docs.module';

@Module({
  imports: [
    UsersModule,
    WorksModule,
    ApprovalQueueModule,
    DocsModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  providers: [ContribService],
  controllers: [ContribController, DocsController]
})
export class ContribModule {}
