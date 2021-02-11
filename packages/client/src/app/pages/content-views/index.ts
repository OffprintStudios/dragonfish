import { Routes } from '@angular/router';

import { ProsePageComponent } from './prose-page/prose-page.component';
import { PoetryPageComponent } from './poetry-page/poetry-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { SectionViewComponent } from './section-view/section-view.component';
import { ContentViewResolver } from '../../resolvers';

export const ContentViewPages = [ProsePageComponent, PoetryPageComponent, PostPageComponent, SectionViewComponent];

export const ContentViewRoutes: Routes = [
    {
        path: 'post/:contentId/:postTitle',
        resolve: {
            contentData: ContentViewResolver,
        },
        runGuardsAndResolvers: 'paramsChange',
        component: PostPageComponent,
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
