import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { PipesModule } from '@dragonfish/client/pipes';

/* Pages */
import { MyLibraryComponent } from './my-library.component';
import { WorksListComponent } from './views/works-list/works-list.component';
import { FavoriteBlogsComponent } from './views/favorite-blogs/favorite-blogs.component';
import { ReadItLaterComponent } from './views/read-it-later/read-it-later.component';
import { FinishedWorksComponent } from './views/finished-works/finished-works.component';
import { ReadingHistoryComponent } from './views/reading-history/reading-history.component';

@NgModule({
    declarations: [
        MyLibraryComponent,
        WorksListComponent,
        FavoriteBlogsComponent,
        ReadItLaterComponent,
        FinishedWorksComponent,
        ReadingHistoryComponent,
    ],
    imports: [CommonModule, MyLibraryRoutingModule, UiModule, IconsModule, MaterialModule, PipesModule],
})
export class MyLibraryModule {}
