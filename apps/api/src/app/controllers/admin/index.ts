import { ApprovalQueueController } from './approval-queue.controller';
import { MetaController } from './meta.controller';
import { UserManagementController } from './user-management.controller';
import { TagsController } from './tags.controller';

export const AdminRoutes = [ApprovalQueueController, MetaController, UserManagementController, TagsController];
