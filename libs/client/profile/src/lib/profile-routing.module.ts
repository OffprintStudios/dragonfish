import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileComponent } from './profile.component';
import { HomeComponent } from './views/home/home.component';
import { WorksComponent } from './views/works/works.component';
import { BlogsComponent } from './views/blogs/blogs.component';
import { BlogPageComponent } from './views/blog-page/blog-page.component';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';
import { WorksListComponent } from './views/works-list/works-list.component';

/* Misc */
import { BlogResolver, ProfileResolver } from './repo';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

const routes: Routes = [
    {
        path: ':pseudId/:userTag',
        component: ProfileComponent,
        resolve: { profileData: ProfileResolver },
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'works',
                component: WorksComponent,
            },
            {
                path: 'blogs',
                component: BlogsComponent,
            },
            {
                path: 'post/:contentId/:contentTitle',
                component: BlogPageComponent,
                resolve: {
                    contentData: BlogResolver,
                },
                runGuardsAndResolvers: 'paramsChange',
            },
            {
                path: 'blogs-list',
                component: BlogsListComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'works-list',
                component: WorksListComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProfileResolver, BlogResolver],
})
export class ProfileRoutingModule {}
