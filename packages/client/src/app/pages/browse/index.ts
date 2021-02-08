import { Routes } from '@angular/router';

import { BrowseComponent } from './browse.component';
import { Resolvers } from '../../resolvers';

export const BrowsePages = [BrowseComponent];

export const BrowseRoutes: Routes = [
    {
        path: 'browse',
        component: BrowseComponent,
        resolve: { feedData: Resolvers.find(x => { return x.name === 'BrowseResolver' }) },
        runGuardsAndResolvers: 'always',
    },
];