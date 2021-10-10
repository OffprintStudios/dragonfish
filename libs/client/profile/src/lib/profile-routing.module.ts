import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileHomeComponent } from './views/profile-home/profile-home.component';
import { ProfileInfoComponent } from './views/profile-info/profile-info.component';
import { WorksComponent } from './views/works/works.component';
import { BlogsComponent } from './views/blogs/blogs.component';
import { BlogPageComponent } from './views/blog-page/blog-page.component';

/* Misc */
import { ProfileResolver } from './profile.resolver';
import { BlogResolver } from './blog.resolver';

const routes: Routes = [
    {
        path: ':pseudId/:userTag',
        resolve: { profileData: ProfileResolver },
        runGuardsAndResolvers: 'paramsChange',
        children: [
            {
                path: '',
                component: ProfileHomeComponent,
                children: [
                    {
                        path: '',
                        component: ProfileInfoComponent,
                    },
                    {
                        path: 'works',
                        component: WorksComponent,
                    },
                    {
                        path: 'blogs',
                        component: BlogsComponent,
                    },
                ],
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
