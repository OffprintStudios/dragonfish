import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore } from '@datorama/akita';
import { CaseFilesState } from './case-files.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'case-files', idKey: '_id' })
export class CaseFilesStore extends EntityStore<CaseFilesState> {
    constructor() {
        super();
    }
}
