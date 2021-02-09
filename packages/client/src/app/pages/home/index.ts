import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { NewsComponent } from './news/news.component';
import { WatchingComponent as WatchingPageComponent } from './watching/watching.component';
import { HomeResolvers } from '../../resolvers/home';

export const HomePages = [HomeComponent, NewsComponent, WatchingPageComponent];

export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        resolve: {
            homeData: HomeResolvers.find((x) => {
                return x.name === 'HomePageResolver';
            }),
        },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'news',
                component: NewsComponent,
                resolve: {
                    feedData: HomeResolvers.find((x) => {
                        return x.name === 'NewsResolver';
                    }),
                },
                runGuardsAndResolvers: 'paramsChange',
            },
        ],
    },
];
