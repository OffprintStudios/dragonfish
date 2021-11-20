import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import {
    BrowseHomeComponent,
    NewWorksPageComponent,
    PopularThisWeekComponent,
    PopularTodayComponent,
    RecommendationsPageComponent,
    SpecialEventsComponent,
} from './views/content-browsing';
import { AuthGuard } from '@dragonfish/client/repository/session/services';
import { BookshelfResolver, BrowseResolver } from './services';
import {
    AllWorksComponent,
    FavoriteBlogsComponent,
    FinishedReadingComponent,
    ReadingHistoryComponent,
    ReadItLaterComponent,
} from './views/content-library';
import { BookshelfViewComponent } from './views/content-library';

const routes: Routes = [
    {
        path: '',
        component: BrowseComponent,
        resolve: { data: BrowseResolver },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: BrowseHomeComponent,
            },
            {
                path: 'new-works',
                component: NewWorksPageComponent,
            },
            {
                path: 'recommendations',
                component: RecommendationsPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'popular-this-week',
                component: PopularThisWeekComponent,
            },
            {
                path: 'popular-today',
                component: PopularTodayComponent,
            },
            {
                path: 'special-events',
                component: SpecialEventsComponent,
            },
            {
                path: 'library',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: AllWorksComponent,
                    },
                    {
                        path: 'favorite-blogs',
                        component: FavoriteBlogsComponent,
                    },
                    {
                        path: 'read-it-later',
                        component: ReadItLaterComponent,
                    },
                    {
                        path: 'finished-reading',
                        component: FinishedReadingComponent,
                    },
                    {
                        path: 'reading-history',
                        component: ReadingHistoryComponent,
                    },
                    {
                        path: 'bookshelf/:id',
                        component: BookshelfViewComponent,
                        resolve: { shelfData: BookshelfResolver },
                        runGuardsAndResolvers: 'always',
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [BrowseResolver, BookshelfResolver],
})
export class BrowseRoutingModule {}
