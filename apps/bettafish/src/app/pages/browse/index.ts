import { Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { SearchComponent } from './search/search.component';
import { NewestWorksComponent } from './newest-works/newest-works.component';
import { FandomTagsComponent } from './fandom-tags/fandom-tags.component';

export const BrowsePages = [
    BrowseComponent,
    SearchComponent,
    NewestWorksComponent,
    FandomTagsComponent,
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
                path: 'fandom-tags',
                component: FandomTagsComponent,
            },
        ],
    },
    {
        path: 'search',
        component: SearchComponent,
    },
];
