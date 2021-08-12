import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SessionState } from './session.state';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {
    public state$ = this.select();
    public token$ = this.select('token');
    public currentUser$ = this.select('currentUser');
    public currAccount$ = this.select('currAccount');

    constructor(protected store: SessionStore) {
        super(store);
    }

    public get currentUser() {
        return this.getValue().currentUser;
    }

    public get currAccount() {
        return this.getValue().currAccount;
    }

    public get token() {
        return this.getValue().token;
    }

    public get isLoggedIn() {
        return !!this.getValue().token;
    }
}
