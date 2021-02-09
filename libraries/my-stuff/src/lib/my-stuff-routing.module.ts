import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyStuffResolvers } from './resolvers';

import { MyStuffViews } from './views';
import { Roles } from '@dragonfish/models/users';
import { MyStuffComponent } from './my-stuff.component';

const routes: Routes = [
    {
        path: '',
        component: MyStuffComponent,
        resolve: { stuffData: MyStuffResolvers.find(x => { return x.name === 'MyStuffResolver' }) },
        children: [
            { path: 'new-blog', component: MyStuffViews.find(x => { return x.name === 'BlogFormComponent' }) },
            {
                path: 'new-post',
                component: MyStuffViews.find(x => { return x.name === 'NewsFormComponent' }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            { path: 'new-prose', component: MyStuffViews.find(x => { return x.name === 'ProseFormComponent' }) },
            { path: 'new-poetry', component: MyStuffViews.find(x => { return x.name === 'PoetryFormComponent' }) },
            { path: 'view-blog', component: MyStuffViews.find(x => { return x.name === 'BlogFormComponent' }) },
            {
                path: 'view-post',
                component: MyStuffViews.find(x => { return x.name === 'NewsFormComponent' }),
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'view-prose',
                component: MyStuffViews.find(x => { return x.name === 'ViewProseComponent' }),
                resolve: { sectionData: MyStuffResolvers.find(x => { return x.name === 'ViewSectionsResolver' }) },
            },
            {
                path: 'view-poetry',
                component: MyStuffViews.find(x => { return x.name === 'ViewPoetryComponent' }),
                resolve: { sectionData: MyStuffResolvers.find(x => { return x.name === 'ViewSectionsResolver' }) },
            },
            { path: 'edit-prose', component: MyStuffViews.find(x => { return x.name === 'ProseFormComponent' }) },
            { path: 'edit-poetry', component: MyStuffViews.find(x => { return x.name === 'PoetryFormComponent' }) },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: [
        ...MyStuffResolvers,
    ],
})
export class MyStuffRoutingModule {}