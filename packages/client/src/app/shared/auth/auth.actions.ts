import { LoginUser, CreateUser } from '@pulp-fiction/models/users';

export namespace Auth {
    export class Login {
        static readonly type = '[Auth] Login';
        constructor(public payload: LoginUser) {}
    }
    
    export class Register {
        static readonly type = '[Auth] Register';
        constructor(public payload: CreateUser) {}
    }
}
