import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { User } from './user.actions';
import { UserStateModel } from './user-state.model';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        currUser: null
    }
})
@Injectable()
export class UserState {

}