import { State, Action, StateContext } from '@ngxs/store';
import { Auth } from './auth.actions';
import { AuthService } from './services';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Injectable } from '@angular/core';

export interface AuthStateModel {
    user: FrontendUser | null;
    isLoggedIn: boolean;
    token: string | null;
    error?: string;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        user: null,
        isLoggedIn: false,
        token: null
    }
})
@Injectable()
export class AuthState {
    constructor(private auth: AuthService) {}

    @Action(Auth.Login)
    login() {

    }

    @Action(Auth.Register)
    register() {

    }

    @Action(Auth.LogOut)
    logout() {

    }
}