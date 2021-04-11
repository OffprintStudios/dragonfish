import { Routes } from '@angular/router';
import { NewsPageComponent } from './news-page/news-page.component';
import { PoetryPageComponent } from './poetry-page/poetry-page.component';
import { ProsePageComponent } from './prose-page/prose-page.component';
import { SectionViewComponent } from './section-view/section-view.component';

/* Utilities */
import { ContentViewResolver } from '../../resolvers';

export const ContentViewPages = [NewsPageComponent, PoetryPageComponent, ProsePageComponent, SectionViewComponent];

export const ContentViewRoutes: Routes = [
    {
        path: 'news/:contentId/:newsTitle',
        resolve: {
            contentData: ContentViewResolver,
        },
        runGuardsAndResolvers: 'paramsChange',
        component: NewsPageComponent,
    },
    {
        path: 'prose/:contentId/:proseTitle',
        component: ProsePageComponent,
        resolve: {
            contentData: ContentViewResolver,
        },
        runGuardsAndResolvers: 'paramsChange',
        children: [{ path: ':sectionNum/:sectionTitle', component: SectionViewComponent }],
    },
    {
        path: 'poetry/:contentId/:poetryTitle',
        component: PoetryPageComponent,
        resolve: {
            contentData: ContentViewResolver,
        },
        runGuardsAndResolvers: 'paramsChange',
        children: [{ path: ':sectionNum/:sectionTitle', component: SectionViewComponent }],
    },
];
