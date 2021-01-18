import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Auth } from './auth.actions';
import { AuthStateModel } from './auth-state.model';
import { AuthService } from './services';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Observable } from 'rxjs';
import { Global } from '../global/global.actions';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        user: null,
        token: null
    }
})
@Injectable()
export class AuthState {
    constructor(private auth: AuthService) {}

    /* Actions */

    /**
     * Logs a user in, then updates the current state with that user's credentials.
     * 
     * @param ctx State Context
     * @param action Action to Perform
     */
    @Action(Auth.Login)
    login(ctx: StateContext<AuthStateModel>, action: Auth.Login): Observable<FrontendUser> {
        return this.auth.login(action.payload).pipe(tap((result: FrontendUser) => {
            ctx.patchState({
                user: result,
                token: result.token
            });
        }));
    }

    /**
     * Registers a new user, then updates the current state with that user's credentials.
     * 
     * @param ctx State Context
     * @param action Action to Perform
     */
    @Action(Auth.Register)
    register(ctx: StateContext<AuthStateModel>, action: Auth.Register): Observable<FrontendUser> {
        return this.auth.register(action.payload).pipe(tap((result: FrontendUser) => {
            ctx.patchState({
                user: result,
                token: result.token
            });
        }));
    }

    /**
     * Logs out the current user, then resets the state.
     * 
     * @param ctx State Context
     * @param action Action to Perform
     */
    @Action(Auth.Logout)
    logout(ctx: StateContext<AuthStateModel>, action: Auth.Logout): Observable<void> {
        return this.auth.logout().pipe(tap((_) => {
            ctx.patchState({
                user: null,
                token: null
            });
        }));
    }

    /* Selectors */

    @Selector()
    static user (state: AuthStateModel): FrontendUser | null {
        return state.user;
    }
    
    @Selector()
    static token (state: AuthStateModel): string | null {
        return state.token;
    }

    @Selector()
    static isLoggedIn (state: AuthStateModel): boolean {
        return !!state.token;
    }
}