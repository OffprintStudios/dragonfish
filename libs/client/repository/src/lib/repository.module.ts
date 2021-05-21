import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

/* States */
import { CollectionsState } from './collections';
import { HistoryState } from './history';

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            CollectionsState,
            HistoryState
        ]),
    ],
})
export class RepositoryModule {}
