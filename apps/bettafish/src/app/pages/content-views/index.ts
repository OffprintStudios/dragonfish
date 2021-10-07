import { Routes } from '@angular/router';
import { NewsPageComponent } from './news-page/news-page.component';

/* Utilities */
import { ContentViewResolver } from '../../resolvers';

export const ContentViewPages = [NewsPageComponent];

export const ContentViewRoutes: Routes = [
    {
        path: 'news/:contentId/:newsTitle',
        resolve: {
            contentData: ContentViewResolver,
        },
        runGuardsAndResolvers: 'paramsChange',
        component: NewsPageComponent,
    },
];
