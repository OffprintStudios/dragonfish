import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ContentViewState } from './content-view.state';
import { ContentViewStore } from './content-view.store';

@Injectable({ providedIn: 'root' })
export class ContentViewQuery extends Query<ContentViewState> {
    public state$ = this.select();
    public currContent$ = this.select('currContent');
    public currComments$ = this.select('currPageComments');
    public loading$ = this.selectLoading();
    public currSection$ = this.select('currSection');
    public ratingsDoc$ = this.select('ratingsDoc');

    constructor(protected store: ContentViewStore) {
        super(store);
    }

    public get contentTitle() {
        return this.getValue().currContent.title;
    }

    public get allSections() {
        return this.getValue().allSections;
    }

    public get currRating() {
        return this.getValue().currRating;
    }

    public get currPage() {
        return this.getValue().currPage;
    }

    public get likes() {
        return this.getValue().likes;
    }

    public get dislikes() {
        return this.getValue().dislikes;
    }
}
