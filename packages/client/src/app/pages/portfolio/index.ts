import { Routes } from '@angular/router';

import { PortfolioComponent } from './portfolio.component';
import { PortfolioHomePages } from './port-home';
import { PortfolioWorksPages } from './works';
import { PortfolioBlogPages } from './blogs';
import { PortfolioCollectionsPages } from './collections';
import { PortfolioHistoryPages } from './history';
import { PortfolioConversationsPages } from './conversations';
import { PortfolioSettingsPages } from './settings';

import { AuthGuard } from '../../shared/auth/services';
import { Resolvers } from '../../resolvers';
import { PortfolioResolvers } from '../../resolvers/portfolio';

export const PortfolioPages = [
    PortfolioComponent,
    ...PortfolioHomePages,
    ...PortfolioWorksPages,
    ...PortfolioBlogPages,
    ...PortfolioCollectionsPages,
    ...PortfolioHistoryPages,
    ...PortfolioConversationsPages,
    ...PortfolioSettingsPages,
];

export const PortfolioRoutes: Routes = [
    {
        path: 'portfolio/:id/:username',
        resolve: {
            portData: PortfolioResolvers.find((x) => {
                return x.name === 'PortfolioResolver';
            }),
        },
        runGuardsAndResolvers: 'always',
        component: PortfolioComponent,
        children: [
            {
                path: 'blogs',
                component: PortfolioBlogPages.find((x) => {
                    return x.name === 'BlogsComponent';
                }),
                resolve: {
                    feedData: PortfolioResolvers.find((x) => {
                        return x.name === 'BlogsResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:contentId',
                resolve: {
                    contentData: Resolvers.find((x) => {
                        return x.name === 'ContentViewResolver';
                    }),
                },
                runGuardsAndResolvers: 'paramsChange',
                component: PortfolioBlogPages.find((x) => {
                    return x.name === 'BlogPageComponent';
                }),
            },
            {
                path: 'works',
                component: PortfolioWorksPages.find((x) => {
                    return x.name === 'WorksComponent';
                }),
                resolve: {
                    feedData: PortfolioResolvers.find((x) => {
                        return x.name === 'WorksResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collections',
                component: PortfolioCollectionsPages.find((x) => {
                    return x.name === 'CollectionsComponent';
                }),
                resolve: {
                    feedData: PortfolioResolvers.find((x) => {
                        return x.name === 'CollectionsResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collection/:collId',
                component: PortfolioCollectionsPages.find((x) => {
                    return x.name === 'CollectionPageComponent';
                }),
                resolve: {
                    collData: PortfolioResolvers.find((x) => {
                        return x.name === 'CollectionsPageResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'history',
                component: PortfolioHistoryPages.find((x) => {
                    return x.name === 'HistoryComponent';
                }),
                canActivate: [AuthGuard],
                resolve: {
                    histData: PortfolioResolvers.find((x) => {
                        return x.name === 'HistoryResolver';
                    }),
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'conversations',
                component: PortfolioConversationsPages.find((x) => {
                    return x.name === 'ConversationsComponent';
                }),
                canActivate: [AuthGuard],
            },
            {
                path: 'settings',
                component: PortfolioSettingsPages.find((x) => {
                    return x.name === 'SettingsComponent';
                }),
                canActivate: [AuthGuard],
            },
            {
                path: 'home',
                component: PortfolioHomePages.find((x) => {
                    return x.name === 'PortHomeComponent';
                }),
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ],
    },
];
