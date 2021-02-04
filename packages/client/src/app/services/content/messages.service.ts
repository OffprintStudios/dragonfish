import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PaginateResult } from '@dragonfish/models/util';
import { MessageThread, CreateInitialMessage, CreateResponse } from '@dragonfish/models/messages';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    private url = `/api/content/messages`;

    constructor(private http: HttpClient, private _snackbar: MatSnackBar) {}

    /**
     * Fetches a user's threads.
     */
    public fetchUserThreads(pageNum: number) {
        return this.http
            .get<PaginateResult<MessageThread>>(`${this.url}/fetch-user--threads/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this._snackbar.open(err.error.message, 'Close');
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a user's threads for the sidenav.
     */
    public fetchUserSidenavThreads() {
        return this.http
            .get<MessageThread[]>(`${this.url}/fetch-user-sidenav-threads`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this._snackbar.open(err.error.message, 'Close');
                    return throwError(err);
                }),
            );
    }

    /**
     * Creates a new thread with a single message, directed towards one user.
     *
     * @param initialMessage The initial message of the thread
     */
    public createNewPrivateThread(initialMessage: CreateInitialMessage) {
        return this.http
            .put<void>(`${this.url}/create-new-private-thread`, initialMessage, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    this._snackbar.open(`Message sent successfully!`, 'Close');
                    return;
                }),
                catchError((err) => {
                    this._snackbar.open(err.error.message, 'Close');
                    return throwError(err);
                }),
            );
    }

    /**
     * Responds to a single thread.
     *
     * @param response A new response
     */
    public createResponse(response: CreateResponse) {
        return this.http
            .put<void>(`${this.url}/create-response`, response, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return;
                }),
                catchError((err) => {
                    this._snackbar.open(err.error.message, 'Close');
                    return throwError(err);
                }),
            );
    }
}
