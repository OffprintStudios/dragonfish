import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Pages */
import { DashboardComponent } from './dashboard.component';
import { ApprovalQueuePages } from './pages/approval-queue';
import { AuditLogPages } from './pages/audit-log';
import { GroupQueuePages } from './pages/group-queue';
import { OverviewPages } from './pages/overview';
import { ReportsPages } from './pages/reports';
import { UsersManagementPages } from './pages/users-management';

/* Util */
import { DashboardResolvers } from './resolvers';
import { Roles } from '@dragonfish/models/users';
import { AuthGuard } from './util';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
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
            { path: '', redirectTo: '/dashboard/overview', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        ...DashboardResolvers,
        AuthGuard,
    ],
})
export class DashboardRoutingModule {}
