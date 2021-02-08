import { DashComponent } from './dash.component';
import { OverviewPages } from './overview';
import { ApprovalQueuePages } from './approval-queue';
import { GroupQueuePages } from './group-queue';
import { ReportsPages } from './reports';
import { UsersManagementPages } from './users-management';
import { AuditLogPages } from './audit-log';

export const DashboardPages = [
    DashComponent,
    ...OverviewPages,
    ...ApprovalQueuePages,
    ...GroupQueuePages,
    ...ReportsPages,
    ...UsersManagementPages,
    ...AuditLogPages,
];