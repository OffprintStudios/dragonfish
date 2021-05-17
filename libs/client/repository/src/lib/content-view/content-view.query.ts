import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ContentViewState } from './content-view.state';
import { ContentViewStore } from '@dragonfish/client/repository/content-view/content-view.store';

@Injectable({ providedIn: 'root' })
export class ContentViewQuery extends Query<ContentViewState> {
    public state$ = this.select();
    public currContent$ = this.select('currContent');
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

    public get likes() {
        return this.getValue().likes;
    }

    public get dislikes() {
        return this.getValue().dislikes;
    }
}
