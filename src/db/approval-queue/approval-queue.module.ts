import { Module } from '@nestjs/common';
import { ApprovalQueueService } from './approval-queue.service';
import { WorksModule } from 'src/db/works/works.module';

@Module({
  imports: [WorksModule],
  providers: [ApprovalQueueService]
})
export class ApprovalQueueModule {}
