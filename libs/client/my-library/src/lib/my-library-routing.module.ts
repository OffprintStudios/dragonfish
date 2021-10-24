import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Pages */
import { MyLibraryComponent } from './my-library.component';
import { WorksListComponent } from './views/works-list/works-list.component';
import { FavoriteBlogsComponent } from './views/favorite-blogs/favorite-blogs.component';
import { ReadItLaterComponent } from './views/read-it-later/read-it-later.component';
import { FinishedWorksComponent } from './views/finished-works/finished-works.component';
import { ReadingHistoryComponent } from './views/reading-history/reading-history.component';

/* Misc */
import { MyLibraryResolver } from './my-library.resolver';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

const routes: Routes = [
    {
        path: '',
        component: MyLibraryComponent,
        canActivate: [AuthGuard],
        resolve: { contentData: MyLibraryResolver },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: WorksListComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'favorite-blogs',
                component: FavoriteBlogsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'read-it-later',
                component: ReadItLaterComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'finished-works',
                component: FinishedWorksComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'reading-history',
                component: ReadingHistoryComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [MyLibraryResolver],
})
export class MyLibraryRoutingModule {}
