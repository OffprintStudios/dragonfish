import * as User from './user.actions';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';

import { AlertsService } from '@dragonfish/client/alerts';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { HttpError } from '@dragonfish/shared/models/util';
import { Injectable } from '@angular/core';
import { NetworkService } from '../../services';
import { PortfolioService } from './../portfolio/services';
import { UserStateModel } from './user-state.model';
import { throwError } from 'rxjs';

@State<UserStateModel>({
    name: 'user',
    defaults: {
        currUser: null,
    },
})
@Injectable()
export class UserState {
    constructor(private networkService: NetworkService, private alerts: AlertsService, private portfolio: PortfolioService) {}

    /* Selectors */

    @Selector()
    static currUser(state: UserStateModel): FrontendUser | null {
        return state.currUser;
    }

    /* Actions */

    @Action(User.SetUser)
    setUser({ patchState }: StateContext<UserStateModel>, action: User.SetUser): void {
        patchState({
            currUser: action.user,
        });
    }

    @Action(User.ChangeEmail)
    changeEmail({ patchState }: StateContext<UserStateModel>, action: User.ChangeEmail) {
        return this.networkService.changeEmail(action.newEmail).pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
        );
    }

    @Action(User.ChangeUsername)
    changeUsername({ patchState, dispatch }: StateContext<UserStateModel>, action: User.ChangeUsername) {
        this.alerts.info(`This action does nothing right now. Check back for a future update!`);
    }

    @Action(User.ChangePassword)
    changePassword({ patchState }: StateContext<UserStateModel>, action: User.ChangePassword) {
        return this.networkService.changePassword(action.newPassword).pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
        );
    }

    @Action(User.ChangeBio)
    changeBio({ patchState }: StateContext<UserStateModel>, action: User.ChangeBio) {
        return this.networkService.changeBio(action.newBio).pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
        );
    }

    @Action(User.AgreeToPolicies)
    agreeToPolicies({ patchState }: StateContext<UserStateModel>, _action: User.AgreeToPolicies) {
        return this.networkService.agreeToPolicies().pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
        );
    }

    @Action(User.ChangeAvatar)
    changeAvatar({ patchState }: StateContext<UserStateModel>, action: User.ChangeAvatar) {
        return this.networkService.changeImage(action.uploader).pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
            catchError((error: HttpError) => {
                this.alerts.error(
                    `Uh-oh! Failed to upload your avatar. ${error.message} (HTTP ${error.statusCode} ${error.error})`,
                );
                return throwError(error);
            }),
        );
    }

    @Action(User.ChangeCoverPic)
    changeCoverPic({ patchState }: StateContext<UserStateModel>, action: User.ChangeCoverPic) {
        return this.networkService.changeImage(action.uploader).pipe(
            tap((result: FrontendUser) => {
                patchState({
                    currUser: result,
                });
                this.portfolio.updateCurrentPortfolio(result);
                this.alerts.success(`Changes saved!`);
            }),
            catchError((error: HttpError) => {
                this.alerts.error(
                    `Uh-oh! Failed to upload your cover pic. ${error.message} (HTTP ${error.statusCode} ${error.error})`,
                );
                return throwError(error);
            }),
        );
    } 

    @Action(User.UpdateTagline)
    updateTagline({ patchState }: StateContext<UserStateModel>, action: User.UpdateTagline) {
        return this.networkService.updateTagline(action.newTagline).pipe(
            tap((result: FrontendUser) => {
                this.alerts.success(`Changes saved!`);
                patchState({
                    currUser: result,
                });
            }),
        );
    }
}
