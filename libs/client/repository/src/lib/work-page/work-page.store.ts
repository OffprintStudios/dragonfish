import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { WorkPageState, createInitialState } from './work-page.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'content-view' })
export class WorkPageStore extends Store<WorkPageState> {
    constructor() {
        super(createInitialState());
    }
}
