import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Routes */
import { HomeRoutes } from './pages/home';
import { BrowseRoutes } from './pages/browse';
import { SocialRoutes } from './pages/social';
import { DocsRoutes } from './pages/docs';
import { MessagesRoutes } from './pages/messages';
import { ContentViewRoutes } from './pages/content-views';
import { ErrorRoutes } from './pages/errors';
import { RegistrationRoutes } from './pages/registration';

/* Resolvers */
import { DocsResolvers } from './resolvers/docs';
import { HomeResolvers } from './resolvers/home';
import { Resolvers } from './resolvers';

/* Util */
import { Roles } from '@dragonfish/shared/models/users';
import { AuthGuard } from '@dragonfish/client/repository/session/services';
import { TagRoutes } from './pages/tags';

const routes: Routes = [
    ...HomeRoutes,
    ...BrowseRoutes,
    ...SocialRoutes,
    ...DocsRoutes,
    ...MessagesRoutes,
    ...ContentViewRoutes,
    ...RegistrationRoutes,
    ...TagRoutes,
    {
        path: 'profile',
        loadChildren: () => import('@dragonfish/client/profile').then((m) => m.ProfileModule),
    },
    {
        path: 'portfolio', redirectTo: 'profile',
    },
    {
        path: 'prose',
        loadChildren: () => import('@dragonfish/client/work-page').then((m) => m.WorkPageModule),
    },
    {
        path: 'poetry',
        loadChildren: () => import('@dragonfish/client/work-page').then((m) => m.WorkPageModule),
    },
    {
        path: 'settings',
        loadChildren: () => import('@dragonfish/client/settings').then((m) => m.SettingsModule),
    },
    {
        path: 'my-library',
        canLoad: [AuthGuard],
        loadChildren: () => import('@dragonfish/client/my-library').then((m) => m.MyLibraryModule),
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
    providers: [...DocsResolvers, ...HomeResolvers, ...Resolvers],
})
export class AppRoutingModule {}
