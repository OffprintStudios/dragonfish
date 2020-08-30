import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, LatestComponent, WatchingComponent, CollectionsComponent, WorksComponent,
    BlogsComponent, InboxComponent, SettingsComponent, HistoryComponent, AlertsComponent } from './pages/home';
  
  import { PortfolioComponent, PortHomeComponent, PortBlogComponent, PortBlogPageComponent,
    PortWorksComponent, PortCollectionsComponent, PortCollectionPageComponent } from './pages/portfolio';
  
  import { WorkPageComponent, SectionPageComponent, NewSectionComponent } from './pages/work-page';
    
  import { ApprovalQueueComponent, DashboardComponent, NewsManagementComponent, DocsComponent,
    ReportsComponent, UsersComponent, AuditComponent, OverviewComponent } from './pages/dashboard';
  
  import { BrowseComponent, GroupsComponent, NewsComponent } from './pages';
  
  import { DocsPageComponent, SiteStaffComponent } from './pages/docs-page';
  
  import { RegisterComponent } from './pages/account';
  
  import { AuthGuard } from './services/auth';
  import { Roles } from '@pulp-fiction/models/users';
  import { SearchComponent, FindUsersComponent, FindBlogsComponent, FindWorksComponent } from './pages/search';
  import { CreateDocComponent, EditDocComponent } from './pages/dashboard/docs';

const routes: Routes = [
    {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, children: [
      {path: '', children: [
        {path: 'latest', component: LatestComponent},
        {path: 'watching', canActivate: [AuthGuard], component: WatchingComponent},
        {path: 'collections', canActivate: [AuthGuard], component: CollectionsComponent},
        {path: 'history', canActivate: [AuthGuard], component: HistoryComponent},
        {path: 'works', canActivate: [AuthGuard], component: WorksComponent},
        {path: 'blogs', canActivate: [AuthGuard], component: BlogsComponent},
        {path: 'inbox', canActivate: [AuthGuard], component: InboxComponent},
        {path: 'settings', canActivate: [AuthGuard], component: SettingsComponent},
        {path: 'alerts', canActivate: [AuthGuard], component: AlertsComponent},
        {path: '', redirectTo: '/home/latest', pathMatch: 'full'},
      ]}
    ]},
    {path: 'browse', component: BrowseComponent},
    {path: 'groups', component: GroupsComponent},
    {path: 'news', component: NewsComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'portfolio/:id/:username', component: PortfolioComponent, children: [
      {path: 'blog', component: PortBlogComponent},
      {path: 'blog/:blogId', component: PortBlogPageComponent},
      {path: 'works', component: PortWorksComponent },
      {path: 'collections', component: PortCollectionsComponent},
      {path: 'collection/:collId', component: PortCollectionPageComponent},
      {path: '', component: PortHomeComponent},
    ]},
    {path: 'work/:workId/:title', component: WorkPageComponent, children: [    
      {path: ':sectionNum/:sectionTitle', component: SectionPageComponent},    
      {path: 'new-section', canActivate: [AuthGuard], component: NewSectionComponent}
    ]},
    {path: 'dashboard', canActivate: [AuthGuard], data: {roles: [Roles.WorkApprover, Roles.Contributor, Roles.Moderator, Roles.Admin]}, component: DashboardComponent, children: [
      {path: 'overview', canActivate:[AuthGuard], component: OverviewComponent, data: {roles: [Roles.Contributor, Roles.WorkApprover, Roles.Moderator, Roles.Admin]}},
      {path: 'queue', canActivate: [AuthGuard], component: ApprovalQueueComponent, data: {roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin]}},
      {path: 'news-management', canActivate: [AuthGuard], component: NewsManagementComponent, data: {roles: [Roles.Contributor, Roles.Moderator, Roles.Admin]}},
      {path: 'docs', canActivate: [AuthGuard], component: DocsComponent, data: {roles: [Roles.Contributor, Roles.Moderator, Roles.Admin]}, children: [
        {path: 'create-doc', canActivate: [AuthGuard], component: CreateDocComponent, data: {roles: [Roles.Admin]}},
        {path: 'edit-doc/:docId', canActivate: [AuthGuard], component: EditDocComponent, data: {roles: [Roles.Contributor, Roles.Moderator, Roles.Admin]}},
      ]},
      {path: 'reports', canActivate: [AuthGuard], component: ReportsComponent, data: {roles: [Roles.Moderator, Roles.Admin]}},
      {path: 'users', canActivate: [AuthGuard], component: UsersComponent, data: {roles: [Roles.Moderator, Roles.Admin]}},
      {path: 'audit-log', canActivate: [AuthGuard], component: AuditComponent, data: {roles: [Roles.Moderator, Roles.Admin]}},
      {path: '', redirectTo: '/dashboard/overview', pathMatch: 'full'},
    ]},
    {path: 'search', component: SearchComponent, children: [
      {path: 'users', component: FindUsersComponent},
      {path: 'blogs', component: FindBlogsComponent},
      {path: 'works', component: FindWorksComponent},
    ]},
    {path: 'site-staff', component: SiteStaffComponent},
    {path: 'docs/:docId', component: DocsPageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}