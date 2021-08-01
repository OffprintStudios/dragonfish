import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertsModule } from '@dragonfish/client/alerts';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { UiModule } from '@dragonfish/client/ui';
import { PipesModule } from '@dragonfish/client/pipes';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MomentModule } from 'ngx-moment';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MarkdownModule } from 'ngx-markdown';

/* Pages */
import { DashboardComponent } from './dashboard.component';
import {
    ApprovalQueueComponent,
    ApprovePoetryComponent,
    ApproveProseComponent,
    SectionViewComponent,
} from './pages/approval-queue';
import { AuditLogComponent } from './pages/audit-log';
import { GroupQueueComponent } from './pages/group-queue';
import { OverviewComponent } from './pages/overview';
import { ReportsComponent } from './pages/reports';
import { UsersManagementComponent } from './pages/users-management';
import { TagsManagementComponent } from './pages/tags-management/tags-management.component';
import { CaseFilesComponent, ViewFileComponent } from './pages/case-files';

/* Components */
import { ApprovalQueueToolbarComponent, ContentPreviewComponent } from './components/approval-queue';
import { TagFormComponent, ChildTagFormComponent, ChildTagItemComponent } from './components/tags-management';
import { ContentReportComponent, UserReportComponent, ReportItemComponent } from './components/case-files';
import { NgSelectModule } from '@ng-select/ng-select';

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
        ChildTagFormComponent,
        ChildTagItemComponent,
        CaseFilesComponent,
        ViewFileComponent,
        ContentReportComponent,
        UserReportComponent,
        ReportItemComponent,
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
        MomentModule,
        MarkdownModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
            track: 'all',
        }),
    ],
})
export class DashboardModule {}
