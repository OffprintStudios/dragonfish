import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { MyStuffComponent } from './my-stuff.component';
import {
    BlogFormComponent,
    NewsFormComponent,
    PoetryFormComponent, ProseFormComponent,
    ViewPoetryComponent,
    ViewProseComponent,
} from './views';

/* Util */
import { ViewSectionsResolver } from './resolvers';
import { Roles } from '@dragonfish/shared/models/users';
import { AuthGuard } from './util';

const routes: Routes = [
    {
        path: '',
        component: MyStuffComponent,
        children: [
            {
                path: 'new-blog',
                component: BlogFormComponent,
            },
            {
                path: 'new-post',
                component: NewsFormComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'new-prose',
                component: ProseFormComponent,
            },
            {
                path: 'new-poetry',
                component: PoetryFormComponent,
            },
            {
                path: 'view-blog',
                component: BlogFormComponent
            },
            {
                path: 'view-post',
                component: NewsFormComponent,
                canActivate: [AuthGuard],
                data: { roles: [Roles.Contributor, Roles.Moderator, Roles.Admin] },
            },
            {
                path: 'view-prose',
                component: ViewProseComponent,
                resolve: {
                    sectionData: ViewSectionsResolver,
                },
            },
            {
                path: 'view-poetry',
                component: ViewPoetryComponent,
                resolve: {
                    sectionData: ViewSectionsResolver,
                },
            },
            {
                path: 'edit-prose',
                component: ProseFormComponent,
            },
            {
                path: 'edit-poetry',
                component: PoetryFormComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, ViewSectionsResolver],
})
export class MyStuffRoutingModule {}
