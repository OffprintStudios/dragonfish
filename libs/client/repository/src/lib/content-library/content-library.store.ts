import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore } from '@datorama/akita';
import { ContentLibraryState } from './content-library.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'content-library', idKey: '_id' })
export class ContentLibraryStore extends EntityStore<ContentLibraryState> {
    constructor() {
        super();
    }
}
