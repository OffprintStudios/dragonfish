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
import { PortfolioRoutes } from './pages/portfolio';
import { SearchRoutes } from './pages/search';
import { DocsRoutes } from './pages/docs';
import { MigrationRoutes } from './pages/migration';
import { DashboardRoutes } from './pages/dash';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    ...HomeRoutes,
    ...BrowseRoutes,
    ...SocialRoutes,
    ...ContentViewRoutes,
    ...AccountRoutes,
    ...MyStuffRoutes,
    ...PortfolioRoutes,
    ...SearchRoutes,
    ...DocsRoutes,
    ...MigrationRoutes,
    ...DashboardRoutes,
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
