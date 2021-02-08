import { Routes } from '@angular/router';

import { SearchComponent } from './search.component';
import { FindUsersComponent } from './find-users/find-users.component';
import { FindBlogsComponent } from './find-blogs/find-blogs.component';
import { FindWorksComponent } from './find-works/find-works.component';

export const SearchPages = [
    SearchComponent,
    FindUsersComponent,
    FindBlogsComponent,
    FindWorksComponent,
];

export const SearchRoutes: Routes = [
    {
        path: 'search',
        component: SearchComponent,
        children: [
            { path: 'users', component: FindUsersComponent },
            { path: 'blogs', component: FindBlogsComponent },
            { path: 'works', component: FindWorksComponent },
        ],
    },
];
