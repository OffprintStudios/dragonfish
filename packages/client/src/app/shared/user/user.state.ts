import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { User } from './user.actions';
import { UserStateModel } from './user-state.model';
import { UserService } from './services';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        currUser: null
    }
})
@Injectable()
export class UserState {
    constructor (private userService: UserService) {}

    @Action(User.SetUser)
    setUser(ctx: StateContext<UserStateModel>, action: User.SetUser): void {
        ctx.patchState({
            currUser: action.user
        });
    }
}