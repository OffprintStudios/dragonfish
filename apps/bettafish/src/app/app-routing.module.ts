import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Routes */
import { HomeRoutes } from './pages/home';
import { SocialRoutes } from './pages/social';
import { DocsRoutes } from './pages/docs';
import { MessagesRoutes } from './pages/messages';
import { ErrorRoutes } from './pages/errors';
import { RegistrationRoutes } from './pages/registration';

/* Resolvers */
import { DocsResolvers } from './resolvers/docs';

/* Util */
import { Roles } from '@dragonfish/shared/models/users';
import { AuthGuard } from '@dragonfish/client/repository/session/services';
import { TagRoutes } from './pages/tags';

const routes: Routes = [
    ...HomeRoutes,
    ...SocialRoutes,
    ...DocsRoutes,
    ...MessagesRoutes,
    ...RegistrationRoutes,
    ...TagRoutes,
    {
        path: 'browse',
        loadChildren: () => import('@dragonfish/client/browse').then((m) => m.BrowseModule),
    },
    {
        path: 'profile',
        loadChildren: () => import('@dragonfish/client/profile').then((m) => m.ProfileModule),
    },
    {
        path: 'portfolio',
        redirectTo: 'profile',
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
    providers: [...DocsResolvers],
})
export class AppRoutingModule {}
