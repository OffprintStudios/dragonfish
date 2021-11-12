import { Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { SearchComponent } from './search/search.component';
import { NewestWorksComponent } from './newest-works/newest-works.component';
import { AllFandomsComponent } from './all-fandoms/all-fandoms.component';

export const BrowsePages = [
    BrowseComponent,
    SearchComponent,
    NewestWorksComponent,
    AllFandomsComponent,
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
            {
                path: 'all-fandoms',
                component: AllFandomsComponent,
            },
        ],
    },
    {
        path: 'search',
        component: SearchComponent,
    },
];
