import { LoginUser, CreateUser } from '@dragonfish/shared/models/users';

export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: LoginUser) {}
}

export class Register {
    static readonly type = '[Auth] Register';
    constructor(public payload: CreateUser) {}
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

export class RefreshToken {
    static readonly type = '[Auth] Refresh Token';
}

