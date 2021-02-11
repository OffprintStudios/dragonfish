import { Routes } from '@angular/router';

import { BrowseComponent } from './browse.component';
import { BrowseResolver } from '../../resolvers/browse';

export const BrowsePages = [BrowseComponent];

export const BrowseRoutes: Routes = [
    {
        path: 'browse',
        component: BrowseComponent,
        resolve: { feedData: BrowseResolver },
        runGuardsAndResolvers: 'always',
    },
];
