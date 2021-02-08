import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Resolvers */
import { DashboardResolvers } from './resolvers/dashboard';
import { DocsResolvers } from './resolvers/docs';
import { HomeResolvers } from './resolvers/home';
import { MigrationResolvers } from './resolvers/migration';
import { PortfolioResolvers } from './resolvers/portfolio';
import { MyStuffResolvers } from './resolvers/my-stuff';
import { Resolvers } from './resolvers';

/* Page Routes */
import { HomeRoutes } from './pages/home';
import { BrowseRoutes } from './pages/browse';
import { SocialRoutes } from './pages/social';
import { ContentViewRoutes } from './pages/content-views';
import { AccountRoutes } from './pages/account';
import { MyStuffRoutes } from './pages/my-stuff';

import { AuthGuard } from './shared/auth/services';
import { Roles } from '@dragonfish/models/users';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    ...HomeRoutes,
    ...BrowseRoutes,
    ...SocialRoutes,
    ...ContentViewRoutes,
    ...AccountRoutes,
    ...MyStuffRoutes,
    {
        path: 'portfolio/:id/:username',
        resolve: { portData: PortfolioResolver },
        runGuardsAndResolvers: 'always',
        component: PortfolioComponent,
        children: [
            {
                path: 'blogs',
                component: BlogsComponent,
                resolve: { feedData: BlogsResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:contentId',
                resolve: { contentData: ContentViewResolver },
                runGuardsAndResolvers: 'paramsChange',
                component: BlogPageComponent,
            },
            {
                path: 'works',
                component: WorksComponent,
                resolve: { feedData: WorksResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collections',
                component: CollectionsComponent,
                resolve: { feedData: CollectionsResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collection/:collId',
                component: CollectionPageComponent,
                resolve: { collData: CollectionPageResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'history',
                component: HistoryComponent,
                canActivate: [AuthGuard],
                resolve: { histData: HistoryResolver },
                runGuardsAndResolvers: 'always',
            },
            { path: 'conversations', component: ConversationsComponent, canActivate: [AuthGuard] },
            { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
            { path: 'home', component: PortHomeComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ],
    },
    {
        path: 'search',
        component: SearchComponent,
        children: [
            { path: 'users', component: FindUsersComponent },
            { path: 'blogs', component: FindBlogsComponent },
            { path: 'works', component: FindWorksComponent },
        ],
    },
    { path: 'terms-of-service', component: TosComponent },
    { path: 'omnibus', component: OmnibusComponent },
    { path: 'what-is-offprint', component: AboutOffprintComponent },
    { path: 'code-of-conduct', component: CodeOfConductComponent },
    {
        path: 'site-staff',
        component: SiteStaffComponent,
        resolve: { staffData: SiteStaffResolver },
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'supporters',
        component: SupportersComponent,
        resolve: { supporterData: SupportersResolver },
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'migration',
        component: MigrationComponent,
        canActivate: [AuthGuard],
        resolve: { contentData: MigrationResolver },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'work/:workId',
                component: MigrateWorkComponent,
                canActivate: [AuthGuard],
                resolve: { workData: MigrateWorkResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:blogId',
                component: MigrateBlogComponent,
                canActivate: [AuthGuard],
                resolve: { blogData: MigrateBlogResolver },
                runGuardsAndResolvers: 'always',
            },
        ],
    },
    {
        path: 'dash',
        component: DashComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
        children: [
            {
                path: 'overview',
                component: OverviewComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'approval-queue',
                component: ApprovalQueueComponent,
                resolve: { queueData: ApprovalQueueResolver },
                runGuardsAndResolvers: 'always',
                canActivate: [AuthGuard],
                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                children: [
                    {
                        path: 'view-prose',
                        component: ApproveProseComponent,
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                        resolve: { contentData: ApproveContentResolver },
                        runGuardsAndResolvers: 'always',
                        children: [
                            {
                                path: ':sectionNum',
                                component: ApproveSectionViewComponent,
                                canActivate: [AuthGuard],
                                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                            },
                        ],
                    },
                    {
                        path: 'view-poetry',
                        component: ApprovePoetryComponent,
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                        resolve: { contentData: ApproveContentResolver },
                        runGuardsAndResolvers: 'always',
                        children: [
                            {
                                path: ':sectionNum',
                                component: ApproveSectionViewComponent,
                                canActivate: [AuthGuard],
                                data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'group-queue',
                component: GroupQueueComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'news-management',
                component: NewsManagementComponent,
                resolve: { newsData: NewsManagementResolver },
                runGuardsAndResolvers: 'always',
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
                children: [
                    {
                        path: 'create-post',
                        component: PostFormComponent,
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.Moderator, Roles.Admin] },
                    },
                    {
                        path: 'edit-post/:postId',
                        component: PostFormComponent,
                        resolve: { postData: PostFormResolver },
                        runGuardsAndResolvers: 'always',
                        canActivate: [AuthGuard],
                        data: { roles: [Roles.Moderator, Roles.Admin] },
                    },
                ],
            },
            {
                path: 'reports',
                component: ReportsComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'users-management',
                component: UsersManagementComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'audit-log',
                component: AuditLogComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Moderator, Roles.Admin] },
            },
            { path: '', redirectTo: '/dash/overview', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
        }),
    ],
    exports: [RouterModule],
    providers: [
        ...DashboardResolvers,
        ...DocsResolvers,
        ...HomeResolvers,
        ...MigrationResolvers,
        ...PortfolioResolvers,
        ...MyStuffResolvers,
        ...Resolvers,
    ],
})
export class AppRoutingModule {}
