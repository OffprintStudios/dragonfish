import { Injectable } from '@angular/core';
import { CreateUser, LoginUser } from '@dragonfish/shared/models/users';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as Auth from '../auth.actions';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    @Dispatch()
    public async login(info: LoginUser) {
        return new Auth.Login(info);
    }

    @Dispatch()
    public async register(info: CreateUser) {
        return new Auth.Register(info);
    }

    @Dispatch()
    public logout() {
        return new Auth.Logout();
    }

    @Dispatch()
    public async refreshToken() {
        return new Auth.RefreshToken();
    }
}
