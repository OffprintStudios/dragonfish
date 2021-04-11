import { Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { TodayComponent } from './today/today.component';
import { SearchComponent } from './search/search.component';
import { NewestWorksComponent } from './newest-works/newest-works.component';

export const BrowsePages = [
    BrowseComponent,
    TodayComponent,
    SearchComponent,
    NewestWorksComponent,
];

export const BrowseRoutes: Routes = [
    {
        path: 'browse',
        component: BrowseComponent,
        children: [
            {
                path: '',
                component: TodayComponent,
                pathMatch: 'full',
            },
            {
                path: 'search',
                component: SearchComponent,
            },
            {
                path: 'newest-works',
                component: NewestWorksComponent,
            },
        ],
    },
];
