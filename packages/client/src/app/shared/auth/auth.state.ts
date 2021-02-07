import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Auth } from './auth.actions';
import { AuthStateModel } from './auth-state.model';
import { NetworkService } from '../../services';

import { FrontendUser } from '@dragonfish/models/users';
import { Observable } from 'rxjs';
import { User } from '../user';
import { Alerts } from '../alerts';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null,
    },
})
@Injectable()
export class AuthState {
    constructor(private network: NetworkService) {}

    /* Actions */

    /**
     * Logs a user in, then updates the current state with that user's credentials.
     */
    @Action(Auth.Login)
    login({ patchState, dispatch }: StateContext<AuthStateModel>, action: Auth.Login): Observable<FrontendUser> {
        return this.network.login(action.payload).pipe(
            tap((result: FrontendUser) => {
                dispatch(new User.SetUser(result));
                patchState({
                    token: result.token,
                });
            }),
        );
    }

    /**
     * Registers a new user, then updates the current state with that user's credentials.
     */
    @Action(Auth.Register)
    register({ patchState, dispatch }: StateContext<AuthStateModel>, action: Auth.Register): Observable<FrontendUser> {
        return this.network.register(action.payload).pipe(
            tap((result: FrontendUser) => {
                dispatch(new User.SetUser(result));
                patchState({
                    token: result.token,
                });
            }),
        );
    }

    /**
     * Logs out the current user, then resets the state.
     */
    @Action(Auth.Logout)
    logout({ patchState, dispatch }: StateContext<AuthStateModel>, _action: Auth.Logout): Observable<void> {
        return this.network.logout().pipe(
            tap((_) => {
                dispatch(new User.SetUser(null));
                patchState({
                    token: null,
                });
            }),
        );
    }

    @Action(Auth.RefreshToken)
    refreshToken(
        { patchState, dispatch }: StateContext<AuthStateModel>,
        _action: Auth.RefreshToken,
    ): Observable<string> {
        return this.network.refreshToken().pipe(
            tap((result: string | null) => {
                if (result === null) {
                    dispatch(new User.SetUser(null));
                    patchState({
                        token: null,
                    });
                    dispatch(new Alerts.Info(`Your token has expired, and you've been logged out.`));
                } else {
                    patchState({
                        token: result,
                    });
                }
            }),
        );
    }

    /* Selectors */

    @Selector()
    static token(state: AuthStateModel): string | null {
        return state.token;
    }

    @Selector()
    static isLoggedIn(state: AuthStateModel): boolean {
        return !!state.token;
    }
}
