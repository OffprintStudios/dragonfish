import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ProfileState } from './profile.state';
import { ProfileStore } from './profile.store';

@Injectable()
export class ProfileQuery extends Query<ProfileState> {
    public profile$ = this.select('currProfile');
    public works$ = this.select('homeWorks');
    public blogs$ = this.select('homeBlogs');
    public pubBlogs$ = this.select('pubBlogs');
    public draftBlogs$ = this.select('draftBlogs');
    public pubWorks$ = this.select('pubWorks');
    public draftWorks$ = this.select('draftWorks');
    public loading$ = this.selectLoading();

    constructor(protected store: ProfileStore) {
        super(store);
    }

    public get userTag() {
        return this.getValue().currProfile.userTag;
    }

    public get profileId() {
        return this.getValue().currProfile._id;
    }

    public get numPubBlogs() {
        return this.getValue().pubBlogs.length;
    }

    public get numDraftBlogs() {
        return this.getValue().draftBlogs.length;
    }

    public get numPubWorks() {
        return this.getValue().pubWorks.length;
    }

    public get numDraftWorks() {
        return this.getValue().draftWorks.length;
    }
}
