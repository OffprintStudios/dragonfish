import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Auth } from './auth.actions';
import { AuthStateModel } from './auth-state.model';
import { AuthService } from './services';

import { FrontendUser } from '@pulp-fiction/models/users';

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

    @Action(Auth.Login)
    login(ctx: StateContext<AuthStateModel>, action: Auth.Login) {
        return this.auth.login(action.payload).pipe(tap((result: FrontendUser) => {
            ctx.patchState({
                user: result,
                token: result.token
            });
        }));
    }

    @Action(Auth.Register)
    register(ctx: StateContext<AuthStateModel>, action: Auth.Register) {
        return this.auth.register(action.payload).pipe(tap((result: FrontendUser) => {
            ctx.patchState({
                user: result,
                token: result.token
            });
        }));
    }

    @Action(Auth.Logout)
    logout(ctx: StateContext<AuthStateModel>, action: Auth.Logout) {
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