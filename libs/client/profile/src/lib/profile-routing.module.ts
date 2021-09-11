import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileComponent } from './profile.component';
import { HomeComponent } from './views/home/home.component';
import { WorksComponent } from './views/works/works.component';
import { BlogsComponent } from './views/blogs/blogs.component';
import { BlogPageComponent } from './views/blog-page/blog-page.component';

/* Misc */
import { BlogResolver, ProfileResolver } from './repo';

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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProfileResolver, BlogResolver],
})
export class ProfileRoutingModule {}
