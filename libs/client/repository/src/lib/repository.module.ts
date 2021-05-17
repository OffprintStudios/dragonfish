import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

/* States */
import { AuthState } from './auth';
import { GlobalState } from './global';
import { UserState } from './user';
import { PortfolioState } from './portfolio';
import { CollectionsState } from './collections';
import { HistoryState } from './history';

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            AuthState,
            GlobalState,
            UserState,
            PortfolioState,
            CollectionsState,
            HistoryState
        ]),
    ],
})
export class RepositoryModule {}
