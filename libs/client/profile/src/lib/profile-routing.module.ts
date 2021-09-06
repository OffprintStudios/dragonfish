import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ProfileComponent } from './profile.component';

/* Misc */
import { ProfileResolver } from './repo';
import { HomeComponent } from './views/home/home.component';
import { WorksComponent } from './views/works/works.component';
import { BlogsComponent } from './views/blogs/blogs.component';

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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProfileResolver],
})
export class ProfileRoutingModule {}
