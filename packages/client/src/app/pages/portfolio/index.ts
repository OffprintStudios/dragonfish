import { Routes } from '@angular/router';

import { PortfolioComponent } from './portfolio.component';
import { PortHomeComponent } from './port-home';
import { WorksComponent } from './works';
import { BlogPageComponent, BlogsComponent } from './blogs';
import { CollectionPageComponent, CollectionsComponent } from './collections';
import { PortHistComponent } from './history';
import { PortConversationsComponent } from './conversations';
import { SettingsComponent } from './settings';

import { AuthGuard } from '../../shared/auth/services';
import { ContentViewResolver } from '../../resolvers';
import { PortfolioResolver, BlogsResolver, WorksResolver, CollectionsResolver, CollectionPageResolver, HistoryResolver } from '../../resolvers/portfolio';

export const PortfolioPages = [
    PortfolioComponent,
    PortHomeComponent,
    WorksComponent,
    BlogsComponent,
    BlogPageComponent,
    CollectionsComponent,
    CollectionPageComponent,
    PortHistComponent,
    PortConversationsComponent,
    SettingsComponent,
];

export const PortfolioRoutes: Routes = [
    {
        path: 'portfolio/:id/:username',
        resolve: {
            portData: PortfolioResolver,
        },
        runGuardsAndResolvers: 'always',
        component: PortfolioComponent,
        children: [
            {
                path: 'blogs',
                component: BlogsComponent,
                resolve: {
                    feedData: BlogsResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:contentId',
                resolve: {
                    contentData: ContentViewResolver,
                },
                runGuardsAndResolvers: 'paramsChange',
                component: BlogPageComponent,
            },
            {
                path: 'works',
                component: WorksComponent,
                resolve: {
                    feedData: WorksResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collections',
                component: CollectionsComponent,
                resolve: {
                    feedData: CollectionsResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'collection/:collId',
                component: CollectionPageComponent,
                resolve: {
                    collData: CollectionPageResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'history',
                component: PortHistComponent,
                canActivate: [AuthGuard],
                resolve: {
                    histData: HistoryResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'conversations',
                component: PortConversationsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'settings',
                component: SettingsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'home',
                component: PortHomeComponent,
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ],
    },
];
