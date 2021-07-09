import { Injectable } from '@angular/core';
import { SessionStore } from '../session.store';
import { SessionQuery } from '../session.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { CreateUser, FrontendUser, LoginUser } from '@dragonfish/shared/models/users';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private sessionStore: SessionStore,
        private sessionQuery: SessionQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    /**
     * Logs a user in.
     * @param payload
     */
    public login(payload: LoginUser) {
        return this.network.login(payload).pipe(
            tap((user: FrontendUser) => {
                this.sessionStore.update({
                    token: user.token,
                    currentUser: user,
                });
                this.alerts.success(`Welcome back!`);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    /**
     * Registers a new user.
     * @param payload
     */
    public register(payload: CreateUser) {
        return this.network.register(payload).pipe(
            tap((user: FrontendUser) => {
                this.sessionStore.update({
                    token: user.token,
                    currentUser: user,
                });
                this.alerts.success(`Glad you could make it!`);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    /**
     * Logs a user out.
     */
    public logout() {
        return this.network.logout().pipe(
            tap(() => {
                this.sessionStore.update({
                    token: null,
                    currentUser: null,
                });
                this.alerts.success(`See you next time!`);
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    /**
     * Attempts to refresh a user's token. If the refresh token is expired, logs a user out.
     */
    public refreshToken() {
        return this.network.refreshToken().pipe(
            tap((result: string | null) => {
                if (result === null) {
                    this.sessionStore.update({
                        token: null,
                        currentUser: null,
                    });
                    this.alerts.info(`Your token has expired, and you've been logged out.`);
                } else {
                    this.sessionStore.update({
                        token: result,
                    });
                }
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }
}
