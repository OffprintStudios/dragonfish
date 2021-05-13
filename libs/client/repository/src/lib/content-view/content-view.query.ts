import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ContentViewState } from './content-view.state';
import { ContentViewStore } from '@dragonfish/client/repository/content-view/content-view.store';

@Injectable({ providedIn: 'root' })
export class ContentViewQuery extends Query<ContentViewState> {
    public currContent$ = this.select('currContent');
    public allSections$ = this.select('allSections');
    public currSection$ = this.select('currSection');
    public ratings$ = this.select('ratings');

    constructor(protected store: ContentViewStore) {
        super(store);
    }
}
