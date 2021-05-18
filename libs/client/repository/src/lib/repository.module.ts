import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

/* States */
import { GlobalState } from './global';
import { CollectionsState } from './collections';
import { HistoryState } from './history';

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            GlobalState,
            CollectionsState,
            HistoryState
        ]),
    ],
})
export class RepositoryModule {}
