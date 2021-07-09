import { ApprovalQueueController } from './approval-queue.controller';
import { MetaController } from './meta.controller';
import { UserManagementController } from './user-management.controller';
import { CaseFilesController } from './case-files.controller';

export const AdminRoutes = [ApprovalQueueController, MetaController, UserManagementController, CaseFilesController];
