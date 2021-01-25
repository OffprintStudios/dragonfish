import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { User } from './user.actions';
import { UserStateModel } from './user-state.model';
import { UserService } from './services';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Alerts } from '../alerts';

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
    setUser({ patchState }: StateContext<UserStateModel>, action: User.SetUser): void {
        patchState({
            currUser: action.user
        });
    }

    @Action(User.ChangeEmail)
    changeEmail({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangeEmail) {
        return this.userService.changeEmail(action.newEmail).pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    @Action(User.ChangeUsername)
    changeUsername({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangeUsername) {
        dispatch(new Alerts.Info(`This action does nothing right now. Check back for a future update!`));
    }

    @Action(User.ChangePassword)
    changePassword({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangePassword) {
        return this.userService.changePassword(action.newPassword).pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    @Action(User.ChangeProfile)
    changeProfile({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangeProfile) {
        return this.userService.changeProfile(action.newProfile).pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    @Action(User.AgreeToPolicies)
    agreeToPolicies({ patchState, dispatch }: StateContext<UserStateModel>, _action: User.AgreeToPolicies) {
        return this.userService.agreeToPolicies().pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    @Action(User.ChangeAvatar)
    changeAvatar({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangeAvatar) {
        return this.userService.changeAvatar(action.uploader).pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    @Action(User.UpdateTagline)
    updateTagline({ patchState, dispatch }: StateContext<UserStateModel>, action: User.UpdateTagline) {
        return this.userService.updateTagline(action.newTagline).pipe(tap((result: FrontendUser) => {
            dispatch(new Alerts.Success(`Changes saved!`));
            patchState({
                currUser: result
            });
        }));
    }

    /* Selectors */

    @Selector()
    static currUser (state: UserStateModel): FrontendUser | null {
        return state.currUser;
    }
}