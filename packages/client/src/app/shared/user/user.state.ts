import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { User } from './user.actions';
import { UserStateModel } from './user-state.model';
import { UserService } from './services';
import { FrontendUser } from '@pulp-fiction/models/users';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        currUser: null
    }
})
@Injectable()
export class UserState {
    constructor (private userService: UserService) {}

    /* Actions */

    @Action(User.SetUser)
    setUser(ctx: StateContext<UserStateModel>, action: User.SetUser): void {
        ctx.patchState({
            currUser: action.user
        });
    }

    @Action(User.ChangeEmail)
    changeEmail(ctx: StateContext<UserStateModel>, action: User.ChangeEmail) {

    }

    @Action(User.ChangeUsername)
    changeUsername(ctx: StateContext<UserStateModel>, action: User.ChangeUsername) {

    }

    @Action(User.ChangePassword)
    changePassword(ctx: StateContext<UserStateModel>, action: User.ChangePassword) {

    }

    @Action(User.ChangeProfile)
    changeProfile(ctx: StateContext<UserStateModel>, action: User.ChangeProfile) {

    }

    @Action(User.AgreeToPolicies)
    agreeToPolicies(ctx: StateContext<UserStateModel>, action: User.AgreeToPolicies) {

    }

    @Action(User.ChangeAvatar)
    changeAvatar(ctx: StateContext<UserStateModel>, action: User.ChangeAvatar) {

    }

    @Action(User.UpdateTagline)
    updateTagline(ctx: StateContext<UserStateModel>, action: User.UpdateTagline) {
        
    }

    /* Selectors */

    @Selector()
    static currUser (state: UserStateModel): FrontendUser | null {
        return state.currUser;
    }
}