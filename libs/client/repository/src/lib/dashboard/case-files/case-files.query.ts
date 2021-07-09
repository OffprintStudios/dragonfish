import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CaseFilesState } from './case-files.state';
import { CaseFilesStore } from './case-files.store';

@Injectable({ providedIn: 'root' })
export class CaseFilesQuery extends QueryEntity<CaseFilesState> {
    constructor(protected store: CaseFilesStore) {
        super(store);
    }
}
