import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioHomeComponent } from './portfolio-home/portfolio-home.component';
import { PortfolioWorksComponent } from './portfolio-works/portfolio-works.component';
import { PortfolioBlogComponent } from './portfolio-blog/portfolio-blog.component';
import { PortfolioCollectionsComponent } from './portfolio-collections/portfolio-collections.component';
import { PortfolioBlogPageComponent } from './portfolio-blog/portfolio-blog-page/portfolio-blog-page.component';
import { PortfolioCollectionPageComponent } from './portfolio-collections/portfolio-collection-page/portfolio-collection-page.component';

/* Util */
import { PortfolioResolver, CollectionPageResolver } from '../../resolvers/portfolio';
import { ContentViewResolver } from '../../resolvers';

export const PortfolioPages = [
    PortfolioComponent,
    PortfolioHomeComponent,
    PortfolioWorksComponent,
    PortfolioBlogComponent,
    PortfolioBlogPageComponent,
    PortfolioCollectionsComponent,
    PortfolioCollectionPageComponent,
];

export const PortfolioRoutes: Routes = [
    {
        path: 'portfolio/:id/:username',
        component: PortfolioComponent,
        resolve: { portData: PortfolioResolver },
        runGuardsAndResolvers: 'always',
        children: [
            { path: '', component: PortfolioHomeComponent },
            {
                path: 'works',
                component: PortfolioWorksComponent,
            },
            {
                path: 'blog',
                component: PortfolioBlogComponent,
            },
            {
                path: 'post/:contentId/:contentTitle',
                component: PortfolioBlogPageComponent,
                resolve: {
                    contentData: ContentViewResolver,
                },
                runGuardsAndResolvers: 'paramsChange',
            },
            {
                path: 'collections',
                component: PortfolioCollectionsComponent,
            },
            {
                path: 'collection/:collId',
                component: PortfolioCollectionPageComponent,
                resolve: {
                    collData: CollectionPageResolver,
                },
                runGuardsAndResolvers: 'always',
            },
        ]
    }
];
