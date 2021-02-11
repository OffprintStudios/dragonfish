import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Resolvers */
import { BrowseResolvers } from './resolvers/browse';
import { DocsResolvers } from './resolvers/docs';
import { HomeResolvers } from './resolvers/home';
import { MigrationResolvers } from './resolvers/migration';
import { PortfolioResolvers } from './resolvers/portfolio';
import { Resolvers } from './resolvers';

/* Page Routes */
import { HomeRoutes } from './pages/home';
import { AccountRoutes } from './pages/account';
import { BrowseRoutes } from './pages/browse';
import { ContentViewRoutes } from './pages/content-views';
import { DocsRoutes } from './pages/docs';
import { MigrationRoutes } from './pages/migration';
import { SocialRoutes } from './pages/social';
import { SearchRoutes } from './pages/search';
import { PortfolioRoutes } from './pages/portfolio';

/* Util */
import { Roles } from '@dragonfish/models/users';
import { AuthGuard } from './shared/auth/services';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    ...HomeRoutes,
    ...AccountRoutes,
    ...BrowseRoutes,
    ...ContentViewRoutes,
    ...DocsRoutes,
    ...MigrationRoutes,
    ...SocialRoutes,
    ...SearchRoutes,
    ...PortfolioRoutes,
    /*{
        path: 'my-stuff',
        canLoad: [AuthGuard],
        loadChildren: () => import('@dragonfish/my-stuff').then((m) => m.MyStuffModule),
    },*/
    {
        path: 'dashboard',
        canLoad: [AuthGuard],
        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
        loadChildren: () => import('@dragonfish/dashboard').then((m) => m.DashboardModule),
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
    providers: [...DocsResolvers, ...HomeResolvers, ...MigrationResolvers, ...PortfolioResolvers, ...Resolvers, ...BrowseResolvers],
})
export class AppRoutingModule {}
