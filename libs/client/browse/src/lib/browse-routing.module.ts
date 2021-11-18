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

const routes: Routes = [
    {
        path: '',
        component: BrowseComponent,
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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class BrowseRoutingModule {}
