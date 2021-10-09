import { MetaService } from './meta.service';
import { ApprovalQueueService } from './approval-queue.service';
import { SystemService } from './system.service';
import { MailService } from './mail.service';

export const AdminServices = [SystemService, MetaService, ApprovalQueueService, MailService];
