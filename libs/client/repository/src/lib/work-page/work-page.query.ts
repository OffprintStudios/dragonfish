import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { WorkPageState } from './work-page.state';
import { WorkPageStore } from './work-page.store';

@Injectable({ providedIn: 'root' })
export class WorkPageQuery extends Query<WorkPageState> {
    public state$ = this.select();
    public content$ = this.select('content');
    public ratings$ = this.select('ratings');

    constructor(protected store: WorkPageStore) {
        super(store);
    }

    public get contentTitle() {
        return this.getValue().content.title;
    }

    public get likes() {
        return this.getValue().content.stats.likes;
    }

    public get dislikes() {
        return this.getValue().content.stats.dislikes;
    }
}
