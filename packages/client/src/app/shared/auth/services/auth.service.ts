import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FrontendUser, CreateUser, LoginUser } from '@pulp-fiction/models/users';

/**
 * ## AuthService
 * 
 * Manages API calls and processes return values for user authentication.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url: string = `/api/auth`;

    constructor(private http: HttpClient) {}

    /**
     * Sends a new user's info to the backend. If the response is successful,
     * the `user` is returned and their info is set in local storage. Otherwise,
     * sends the backend error to all subscribed observables.
     *
     * @param credentials A user's credentials.
     */
    public register(credentials: CreateUser): Observable<FrontendUser> {
        return this.http.post<FrontendUser>(`${this.url}/register`, credentials, { observe: 'response', withCredentials: true })
            .pipe(map(user => {
                return user.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Sends a returning user's credentials to the backend to be verified.
     * If the response is successful, the `user` is returned. Otherwise, sends the backend error to all
     * subscribed observables.
     *
     * @param credentials A user's credentials.
     */
    public login(credentials: LoginUser): Observable<FrontendUser> {
        return this.http.post<FrontendUser>(`${this.url}/login`, credentials, { withCredentials: true, observe: 'response' })
            .pipe(map(user => {
                return user.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Logs the user out.
     */
    public logout(): Observable<void> {
        return this.http.get<void>(`${this.url}/logout`, { withCredentials: true });
    }

    /**
     * Refreshes the current user token with new User info.
     * If refresh fails, return `null`.
     */
    public refreshToken(): Observable<string | null> {
        return this.http.get<{newToken: string}>(`${this.url}/refresh-token`, { observe: 'response', withCredentials: true })
            .pipe(map(user => {
                console.log(user.body);
                return user.body.newToken;
            }), catchError(err => {
                console.log(`Response Error: ${JSON.stringify(err)}`);
                if (err.status === 403) {
                    // A 403 means that the refreshToken has expired, or we didn't send one up at all, which is Super Suspicious          
                    return null;          
                }
                return throwError(err);
            }));
    }
}