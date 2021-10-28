import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { PipesModule } from '@dragonfish/client/pipes';
import { AlertsModule } from '@dragonfish/client/alerts';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

/* Pages */
import { MyLibraryComponent } from './my-library.component';
import { WorksListComponent } from './views/works-list/works-list.component';
import { FavoriteBlogsComponent } from './views/favorite-blogs/favorite-blogs.component';
import { ReadItLaterComponent } from './views/read-it-later/read-it-later.component';
import { FinishedWorksComponent } from './views/finished-works/finished-works.component';
import { ReadingHistoryComponent } from './views/reading-history/reading-history.component';
import { BookshelfViewComponent } from './views/bookshelf-view/bookshelf-view.component';

/* Components */
import { LibraryMenuComponent } from './components/library-menu/library-menu.component';
import { LibrarySubMenuComponent } from './components/library-menu/library-sub-menu/library-sub-menu.component';
import { ShelfMenuComponent } from './components/shelf-menu/shelf-menu.component';

@NgModule({
    declarations: [
        MyLibraryComponent,
        WorksListComponent,
        FavoriteBlogsComponent,
        ReadItLaterComponent,
        FinishedWorksComponent,
        ReadingHistoryComponent,
        BookshelfViewComponent,
        LibraryMenuComponent,
        LibrarySubMenuComponent,
        ShelfMenuComponent,
    ],
    imports: [
        CommonModule,
        MyLibraryRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        AlertsModule,
        ContextMenuModule,
    ],
})
export class MyLibraryModule {}
