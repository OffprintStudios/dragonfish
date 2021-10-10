import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ProfileState } from './profile.state';
import { ProfileStore } from './profile.store';

@Injectable({ providedIn: 'root' })
export class ProfileQuery extends Query<ProfileState> {
    public profile$ = this.select('currProfile');
    public works$ = this.select('homeWorks');
    public blogs$ = this.select('homeBlogs');
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
}
