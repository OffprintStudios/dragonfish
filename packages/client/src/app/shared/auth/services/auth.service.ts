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
   * If the response is successful, the `user` is returned and their info
   * is set in local storage. Otherwise, sends the backend error to all
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
}