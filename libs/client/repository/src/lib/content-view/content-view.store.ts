import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ContentViewState, createInitialState } from './content-view.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'content-view' })
export class ContentViewStore extends Store<ContentViewState> {
    constructor() {
        super(createInitialState())
    }
}
