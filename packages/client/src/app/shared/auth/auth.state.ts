import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from './auth.actions';
import { AuthStateModel } from './auth-state.model';
import { AuthService } from './services';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Observable } from 'rxjs';
import { User } from '../user';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null
    }
})
@Injectable()
export class AuthState {
    constructor(private auth: AuthService, private snackBar: MatSnackBar) {}

    /* Actions */

    /**
     * Logs a user in, then updates the current state with that user's credentials.
     */
    @Action(Auth.Login)
    login({ patchState, dispatch }: StateContext<AuthStateModel>, action: Auth.Login): Observable<FrontendUser> {
        return this.auth.login(action.payload).pipe(tap((result: FrontendUser) => {
            dispatch(new User.SetUser(result));
            patchState({
                token: result.token
            });
        }));
    }

    /**
     * Registers a new user, then updates the current state with that user's credentials.
     */
    @Action(Auth.Register)
    register({ patchState, dispatch }: StateContext<AuthStateModel>, action: Auth.Register): Observable<FrontendUser> {
        return this.auth.register(action.payload).pipe(tap((result: FrontendUser) => {
            dispatch(new User.SetUser(result));
            patchState({
                token: result.token
            });
        }));
    }

    /**
     * Logs out the current user, then resets the state.
     */
    @Action(Auth.Logout)
    logout({ patchState, dispatch }: StateContext<AuthStateModel>, _action: Auth.Logout): Observable<void> {
        return this.auth.logout().pipe(tap((_) => {
            dispatch(new User.SetUser(null));
            patchState({
                token: null
            });
        }));
    }

    @Action(Auth.RefreshToken)
    refreshToken({ patchState, dispatch }: StateContext<AuthStateModel>, _action: Auth.RefreshToken): Observable<FrontendUser> {
        return this.auth.refreshToken().pipe(tap((result: FrontendUser | null) => {
            if (result === null) {
                dispatch(new User.SetUser(null));
                patchState({
                    token: null
                });
                this.snackBar.open(`Your token has expired, and you've been logged out.`);
            } else {
                patchState({
                    token: result.token
                });
            }
        }));
    }

    /* Selectors */
    
    @Selector()
    static token (state: AuthStateModel): string | null {
        return state.token;
    }

    @Selector()
    static isLoggedIn (state: AuthStateModel): boolean {
        return !!state.token;
    }
}