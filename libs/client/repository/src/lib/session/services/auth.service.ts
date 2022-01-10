import { Injectable } from '@angular/core';
import { SessionStore } from '../session.store';
import { SessionQuery } from '../session.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { LoginModel, AccountForm, PseudonymForm, Pseudonym } from '@dragonfish/shared/models/accounts';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginPackage } from '@dragonfish/shared/models/auth';
import { PseudonymsService } from '../../pseudonyms/services';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private sessionStore: SessionStore,
        private sessionQuery: SessionQuery,
        private pseudService: PseudonymsService,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private router: Router,
    ) {}

    /**
     * Logs a user in.
     * @param payload
     */
    public login(payload: LoginModel) {
        return this.network.login(payload).pipe(
            tap((user: LoginPackage) => {
                this.sessionStore.update({
                    token: user.token,
                    currAccount: user.account,
                });
                this.pseudService.setAll(user.account.pseudonyms);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    /**
     * Registers a new user.
     * @param payload
     */
    public register(payload: AccountForm) {
        return this.network.register(payload).pipe(
            tap((user: LoginPackage) => {
                this.sessionStore.update({
                    token: user.token,
                    currAccount: user.account,
                });
                this.pseudService.setAll(user.account.pseudonyms);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    /**
     * Logs a user out.
     */
    public logout() {
        return this.network.logout().pipe(
            tap(() => {
                this.postLogout();
                this.alerts.success(`See you next time!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public forceLogout() {
        return this.network.logout().pipe(
            tap(() => {
                this.postLogout();
                this.alerts.error("Forcing logout to resolve error");
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
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
                    this.postLogout();
                    this.alerts.info(`Your token has expired, and you've been logged out.`);
                } else {
                    this.sessionStore.update({
                        token: result,
                    });
                }
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    /**
     * Creates a new Pseudonym associated with the current account
     * @param formData
     */
    public createPseudonym(formData: PseudonymForm) {
        return this.network.addPseudonym(formData).pipe(
            tap((result: Pseudonym) => {
                this.sessionStore.update(({ currAccount }) => {
                    if (currAccount && currAccount.pseudonyms) {
                        const newPseudonyms = [...currAccount.pseudonyms, result];
                        currAccount = {
                            ...currAccount,
                            pseudonyms: newPseudonyms
                        }
                    }
                });
                this.pseudService.addOne(result);
            }),
            catchError((err) => {
                return throwError(() => err);
            }),
        );
    }

    /**
     * Checks to see if the current pseudonym is owned by the current session.
     * @param pseudId
     */
    public checkPseudonym(pseudId: string) {
        if (this.sessionQuery.currAccount) {
            return this.sessionQuery.currAccount.pseudonyms.some((elem) => elem._id === pseudId);
        } else {
            return false;
        }
    }

    /**
     * Determines if the given userTag is already in use
     * @param userTag
     * @returns
     */
    public userTagExists(userTag: string): Observable<boolean> {
        return this.network.userTagExists(userTag);
    }

    /**
     * Actions taken client-side after logout, both in user requested and forced logout cases
     */
    private postLogout() {
        this.sessionStore.update({
            token: null,
            currAccount: null,
        });
        this.pseudService.clearAll();
        this.router.navigate(['/']).catch((err) => console.log(err));
    }
}
