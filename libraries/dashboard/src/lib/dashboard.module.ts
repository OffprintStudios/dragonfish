import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertsModule } from '@dragonfish/alerts';
import { IconsModule } from '@dragonfish/icons';
import { MaterialModule } from '@dragonfish/material';
import { ComponentsModule } from '@dragonfish/components';
import { PipesModule } from '@dragonfish/pipes';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Pages */
import { DashboardComponent } from './dashboard.component';
import { ApprovalQueueComponent, ApprovePoetryComponent, ApproveProseComponent, ApproveSectionViewComponent } from './pages/approval-queue';
import { AuditLogComponent } from './pages/audit-log';
import { GroupQueueComponent } from './pages/group-queue';
import { OverviewComponent } from './pages/overview';
import { ReportsComponent } from './pages/reports';
import { UsersManagementComponent } from './pages/users-management';

/* Components */

/* State */
import { ApprovalQueueState } from './shared/approval-queue';

/* Services */
import { ApprovalQueueService } from './shared/approval-queue/services';

@NgModule({
    declarations: [
        DashboardComponent,
        ApprovalQueueComponent,
        ApprovePoetryComponent,
        ApproveProseComponent,
        ApproveSectionViewComponent,
        AuditLogComponent,
        GroupQueueComponent,
        OverviewComponent,
        ReportsComponent,
        UsersManagementComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        AlertsModule,
        IconsModule,
        MaterialModule,
        ComponentsModule,
        NgxPaginationModule,
        PipesModule,
        NgxsModule.forFeature([ApprovalQueueState]),
    ],
    providers: [ApprovalQueueService],
})
export class DashboardModule {}
