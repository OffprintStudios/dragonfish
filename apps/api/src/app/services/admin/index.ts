import { MetaService } from './meta.service';
import { ApprovalQueueService } from './approval-queue.service';
import { SystemService } from './system.service';

export const AdminServices = [SystemService, MetaService, ApprovalQueueService];
