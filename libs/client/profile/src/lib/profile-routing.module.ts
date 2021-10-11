import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileHomeComponent } from './views/profile-home/profile-home.component';
import { ProfileInfoComponent } from './views/profile-info/profile-info.component';
import { WorksComponent } from './views/works/works.component';
import { BlogsComponent } from './views/blogs/blogs.component';
import { BlogPageComponent } from './views/blog-page/blog-page.component';
import { BlogCommentsComponent } from './views/blog-comments/blog-comments.component';

/* Misc */
import { ProfileResolver } from './profile.resolver';
import { BlogResolver } from './blog.resolver';
import { UserBlogsResolver } from './user-blogs.resolver';
import { BlogCommentsResolver } from './blog-comments.resolver';

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
                        resolve: { data: UserBlogsResolver },
                        runGuardsAndResolvers: 'always',
                    },
                    {
                        path: 'home',
                        redirectTo: '',
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
                children: [
                    {
                        path: 'comments',
                        component: BlogCommentsComponent,
                        resolve: {
                            commentsData: BlogCommentsResolver,
                        },
                        runGuardsAndResolvers: 'always',
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProfileResolver, BlogResolver, UserBlogsResolver, BlogCommentsResolver],
})
export class ProfileRoutingModule {}
