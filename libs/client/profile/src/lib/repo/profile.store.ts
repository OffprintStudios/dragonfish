import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { createInitialState, ProfileState } from './profile.state';

@Injectable()
@StoreConfig({ name: 'profile' })
export class ProfileStore extends Store<ProfileState> {
    constructor() {
        super(createInitialState());
    }
}
