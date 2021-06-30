import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Routes */
import { HomeRoutes } from './pages/home';
import { BrowseRoutes } from './pages/browse';
import { SocialRoutes } from './pages/social';
import { DocsRoutes } from './pages/docs';
import { PortfolioRoutes } from './pages/portfolio';
import { MessagesRoutes } from './pages/messages';
import { ContentViewRoutes } from './pages/content-views';
import { ErrorRoutes } from './pages/errors';
import { SettingsRoutes } from './pages/settings';

/* Resolvers */
import { DocsResolvers } from './resolvers/docs';
import { HomeResolvers } from './resolvers/home';
import { PortfolioResolvers } from './resolvers/portfolio';
import { Resolvers } from './resolvers';

/* Util */
import { Roles } from '@dragonfish/shared/models/users';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

const routes: Routes = [
    ...HomeRoutes,
    ...BrowseRoutes,
    ...SocialRoutes,
    ...DocsRoutes,
    ...PortfolioRoutes,
    ...MessagesRoutes,
    ...ContentViewRoutes,
    ...SettingsRoutes,
    {
        path: 'my-stuff',
        canLoad: [AuthGuard],
        loadChildren: () => import('@dragonfish/client/my-stuff').then((m) => m.MyStuffModule),
    },
    {
        path: 'dashboard',
        canLoad: [AuthGuard],
        data: { roles: [Roles.WorkApprover, Roles.Moderator, Roles.Admin] },
        loadChildren: () => import('@dragonfish/client/dashboard').then((m) => m.DashboardModule),
    },
    ...ErrorRoutes,
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
    providers: [...DocsResolvers, ...HomeResolvers, ...PortfolioResolvers, ...Resolvers],
})
export class AppRoutingModule {}
