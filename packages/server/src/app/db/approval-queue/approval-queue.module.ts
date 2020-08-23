import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApprovalQueueSchema } from './approval-queue.schema';
import { ApprovalQueueService } from './approval-queue.service';
import { WorksModule } from '../works/works.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'ApprovalQueue', schema: ApprovalQueueSchema}]),
    WorksModule
  ],
  providers: [ApprovalQueueService],
  exports: [ApprovalQueueService]
})
export class ApprovalQueueModule {}
