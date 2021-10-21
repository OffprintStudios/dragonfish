import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContentLibraryState } from './content-library.state';
import { ContentLibraryStore } from './content-library.store';

@Injectable({ providedIn: 'root' })
export class ContentLibraryQuery extends QueryEntity<ContentLibraryState> {
    public all$ = this.selectAll();

    constructor(protected store: ContentLibraryStore) {
        super(store);
    }

    public get numLibrary() {
        return this.getCount();
    }
}
