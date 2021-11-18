import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { ClickOutsideModule } from 'ng-click-outside';
import {
    BrowseHomeComponent,
    NewWorksPageComponent,
    PopularThisWeekComponent,
    PopularTodayComponent,
    RecommendationsPageComponent,
    SpecialEventsComponent,
} from './views/content-browsing';
import {
    AllWorksComponent,
    FavoriteBlogsComponent,
    ReadItLaterComponent,
    FinishedReadingComponent,
    ReadingHistoryComponent,
} from './views/content-library';
import { LibraryMenuComponent, ShelfMenuComponent } from './components';

@NgModule({
    imports: [
        CommonModule,
        BrowseRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        ContextMenuModule,
        ClickOutsideModule,
    ],
    declarations: [
        BrowseComponent,
        BrowseHomeComponent,
        NewWorksPageComponent,
        PopularThisWeekComponent,
        PopularTodayComponent,
        RecommendationsPageComponent,
        SpecialEventsComponent,
        AllWorksComponent,
        FavoriteBlogsComponent,
        ReadItLaterComponent,
        FinishedReadingComponent,
        ReadingHistoryComponent,
        LibraryMenuComponent,
        ShelfMenuComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BrowseModule {}
