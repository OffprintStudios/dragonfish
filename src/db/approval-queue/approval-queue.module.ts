import { Module } from '@nestjs/common';
import { ApprovalQueueService } from './approval-queue.service';

@Module({
  providers: [ApprovalQueueService]
})
export class ApprovalQueueModule {}
