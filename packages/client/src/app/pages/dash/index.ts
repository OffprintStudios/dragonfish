import { Routes } from '@angular/router';

import { DashComponent } from './dash.component';
import { OverviewPages } from './overview';
import { ApprovalQueuePages } from './approval-queue';
import { GroupQueuePages } from './group-queue';
import { ReportsPages } from './reports';
import { UsersManagementPages } from './users-management';
import { AuditLogPages } from './audit-log';

import { DashboardResolvers } from '../../resolvers/dashboard';
import { AuthGuard } from '../../shared/auth/services';
import { Roles } from '@dragonfish/models/users';

export const DashboardPages = [
    DashComponent,
    ...OverviewPages,
    ...ApprovalQueuePages,
    ...GroupQueuePages,
    ...ReportsPages,
    ...UsersManagementPages,
    ...AuditLogPages,
];

export const DashboardRoutes: Routes = [
    {
        path: 'dash',
        component: DashComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
        children: [
            {
                path: 'overview',
                component: OverviewPages.find((x) => {
                    return x.name === 'OverviewComponent';
                }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'approval-queue',
                component: ApprovalQueuePages.find((x) => {
                    return x.name === 'ApprovalQueueComponent';
                }),
                resolve: {
                    queueData: DashboardResolvers.find((x) => {
                        return x.name === 'ApprovalQueueResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
                canActivate: [AuthGuard],
                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                children: [
                    {
                        path: 'view-prose',
                        component: ApprovalQueuePages.find((x) => {
                            return x.name === 'ApproveProseComponent';
                        }),
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                        resolve: {
                            contentData: DashboardResolvers.find((x) => {
                                return x.name === 'ApproveContentResolver';
                            }),
                        },
                        runGuardsAndResolvers: 'always',
                        children: [
                            {
                                path: ':sectionNum',
                                component: ApprovalQueuePages.find((x) => {
                                    return x.name === 'SectionViewComponent';
                                }),
                                canActivate: [AuthGuard],
                                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                            },
                        ],
                    },
                    {
                        path: 'view-poetry',
                        component: ApprovalQueuePages.find((x) => {
                            return x.name === 'ApprovePoetryComponent';
                        }),
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                        resolve: {
                            contentData: DashboardResolvers.find((x) => {
                                return x.name === 'ApproveContentResolver';
                            }),
                        },
                        runGuardsAndResolvers: 'always',
                        children: [
                            {
                                path: ':sectionNum',
                                component: ApprovalQueuePages.find((x) => {
                                    return x.name === 'SectionViewComponent';
                                }),
                                canActivate: [AuthGuard],
                                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'group-queue',
                component: GroupQueuePages.find((x) => {
                    return x.name === 'GroupQueueComponent';
                }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'reports',
                component: ReportsPages.find((x) => {
                    return x.name === 'ReportsComponent';
                }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'users-management',
                component: UsersManagementPages.find((x) => {
                    return x.name === 'UsersManagementComponent';
                }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'audit-log',
                component: AuditLogPages.find((x) => {
                    return x.name === 'AuditLogComponent';
                }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            { path: '', redirectTo: '/dash/overview', pathMatch: 'full' },
        ],
    },
];
