import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertsModule } from '@dragonfish/client/alerts';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { UiModule } from '@dragonfish/client/ui';
import { PipesModule } from '@dragonfish/client/pipes';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Pages */
import { DashboardComponent } from './dashboard.component';
import { ApprovalQueueComponent, ApprovePoetryComponent, ApproveProseComponent, SectionViewComponent } from './pages/approval-queue';
import { AuditLogComponent } from './pages/audit-log';
import { GroupQueueComponent } from './pages/group-queue';
import { OverviewComponent } from './pages/overview';
import { ReportsComponent } from './pages/reports';
import { UsersManagementComponent } from './pages/users-management';
import { TagsManagementComponent } from './pages/tags-management/tags-management.component';

/* Components */
import { ApprovalQueueToolbarComponent, ContentPreviewComponent } from './components/approval-queue';
import { TagFormComponent } from './components/tags-management';

/* State */
import { ApprovalQueueState } from './shared/approval-queue';

/* Services */
import { ApprovalQueueService } from './shared/approval-queue/services';
import { UserManagementService } from './shared/user-management/services';

@NgModule({
    declarations: [
        DashboardComponent,
        ApprovalQueueComponent,
        ApprovePoetryComponent,
        ApproveProseComponent,
        SectionViewComponent,
        AuditLogComponent,
        GroupQueueComponent,
        OverviewComponent,
        ReportsComponent,
        UsersManagementComponent,
        ApprovalQueueToolbarComponent,
        ContentPreviewComponent,
        TagsManagementComponent,
        TagFormComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        AlertsModule,
        IconsModule,
        MaterialModule,
        UiModule,
        NgxPaginationModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        NgxsModule.forFeature([ApprovalQueueState]),
    ],
    providers: [ApprovalQueueService, UserManagementService],
})
export class DashboardModule {}
