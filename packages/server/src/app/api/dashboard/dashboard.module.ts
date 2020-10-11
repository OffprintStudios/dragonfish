import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { NewsController } from './news/news.controller';
import { NewsModule } from '../../db/news';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { UsersModule } from '../../db/users/users.module';
import { ApprovalQueueModule } from '../../db/approval-queue/approval-queue.module';
import { DocsModule } from '../../db/docs/docs.module';
import { QueueController } from './queue/queue.controller';
import { DocsController } from './docs/docs.controller';
import { QueueService } from './queue/queue.service';
import { WorksModule } from '../../db/works/works.module';
import { ContentModule } from '../../db/content';

@Module({
  imports: [
    ContentModule, UsersModule, ApprovalQueueModule, DocsModule, WorksModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [NewsController, QueueController, DocsController],
  providers: [QueueService],
})
export class DashboardModule {}
