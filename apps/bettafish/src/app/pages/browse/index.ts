import { Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { SearchComponent } from './search/search.component';
import { NewestWorksComponent } from './newest-works/newest-works.component';

export const BrowsePages = [
    BrowseComponent,
    SearchComponent,
    NewestWorksComponent,
];

export const BrowseRoutes: Routes = [
    {
        path: 'browse',
        component: BrowseComponent,
        children: [
            {
                path: 'newest-works',
                component: NewestWorksComponent,
            },
        ],
    },
    {
        path: 'search',
        component: SearchComponent,
    },
];
