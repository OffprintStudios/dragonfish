import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

/* States */
import { HistoryState } from './history';

@NgModule({
    imports: [CommonModule, NgxsModule.forFeature([HistoryState])],
})
export class RepositoryModule {}
