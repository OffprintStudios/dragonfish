export { MyStuffService } from './my-stuff.service';
export { MyStuffComponents } from './components';

import { Routes } from '@angular/router';

import { AuthGuard } from '../../shared/auth/services';
import { MyStuffComponent } from './my-stuff.component';
import { MyStuffViews } from './views';
import { MyStuffResolvers } from '../../resolvers/my-stuff';
import { Roles } from '@dragonfish/models/users';

export const MyStuffPages = [
    MyStuffComponent,
    ...MyStuffViews,
];

export const MyStuffRoutes: Routes = [
    {
        path: 'my-stuff',
        component: MyStuffComponent,
        canActivate: [AuthGuard],
        resolve: { stuffData: MyStuffResolvers.find(x => { return x.name === 'MyStuffResolver' }) },
        children: [
            { path: 'new-blog', component: MyStuffViews.find(x => { return x.name === 'BlogFormComponent' }), canActivate: [AuthGuard] },
            {
                path: 'new-post',
                component: MyStuffViews.find(x => { return x.name === 'NewsFormComponent' }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            { path: 'new-prose', component: MyStuffViews.find(x => { return x.name === 'ProseFormComponent' }), canActivate: [AuthGuard] },
            { path: 'new-poetry', component: MyStuffViews.find(x => { return x.name === 'PoetryFormComponent' }), canActivate: [AuthGuard] },
            { path: 'view-blog', component: MyStuffViews.find(x => { return x.name === 'BlogFormComponent' }), canActivate: [AuthGuard] },
            {
                path: 'view-post',
                component: MyStuffViews.find(x => { return x.name === 'NewsFormComponent' }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'view-prose',
                component: MyStuffViews.find(x => { return x.name === 'ViewProseComponent' }),
                canActivate: [AuthGuard],
                resolve: { sectionData: MyStuffResolvers.find(x => { return x.name === 'ViewSectionsResolver' }) },
            },
            {
                path: 'view-poetry',
                component: MyStuffViews.find(x => { return x.name === 'ViewPoetryComponent' }),
                canActivate: [AuthGuard],
                resolve: { sectionData: MyStuffResolvers.find(x => { return x.name === 'ViewSectionsResolver' }) },
            },
            { path: 'edit-prose', component: MyStuffViews.find(x => { return x.name === 'ProseFormComponent' }), canActivate: [AuthGuard] },
            { path: 'edit-poetry', component: MyStuffViews.find(x => { return x.name === 'PoetryFormComponent' }), canActivate: [AuthGuard] },
        ],
    },
];
