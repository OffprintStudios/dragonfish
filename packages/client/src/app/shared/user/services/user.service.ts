import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import {
    FrontendUser,
    ChangeEmail,
    ChangeUsername,
    ChangePassword,
    ChangeProfile,
    UpdateTagline,
} from '@dragonfish/models/users';
import { HttpError } from '../../../models/site';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private url = `/api/auth`;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    /**
     * Sends a request to change a user's email.
     *
     * @param newEmail The requested new email and current password.
     */
    public changeEmail(newEmail: ChangeEmail): Observable<FrontendUser> {
        return this.http
            .patch<FrontendUser>(`${this.url}/change-email`, newEmail, { observe: 'response', withCredentials: true })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to change a user's username.
     *
     * @param newUsername The reuqested new username and current password.
     */
    public changeUsername(newUsername: ChangeUsername): Observable<FrontendUser> {
        return this.http
            .patch<FrontendUser>(`${this.url}/change-username`, newUsername, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to change a user's password.
     *
     * @param newPasswordInfo The new password requested
     */
    public changePassword(newPasswordInfo: ChangePassword): Observable<FrontendUser> {
        return this.http
            .patch<FrontendUser>(`${this.url}/change-password`, newPasswordInfo, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to change a user's profile.
     *
     * @param newProfileInfo The new profile info requested
     */
    public changeProfile(newProfileInfo: ChangeProfile): Observable<FrontendUser> {
        return this.http
            .patch<FrontendUser>(`${this.url}/update-profile`, newProfileInfo, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a message to the server instructing it to set the user's
     * 'agreedToPolicies' field to true. On success, returns the updated
     * user object.
     */
    public agreeToPolicies(): Observable<FrontendUser> {
        return this.http
            .post<FrontendUser>(`${this.url}/agree-to-policies`, null, { observe: 'response', withCredentials: true })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Uploads a user's avatar to the server for processing.
     *
     * @param uploader the file uploader
     */
    public changeAvatar(uploader: FileUploader): Observable<FrontendUser> {
        return new Observable<FrontendUser>((observer) => {
            uploader.onCompleteItem = (_: FileItem, response: string, status: number, __: ParsedResponseHeaders) => {
                if (status !== 201) {
                    const errorMessage: HttpError = this.tryParseJsonHttpError(response);
                    if (!errorMessage) {
                        const juryRiggedError: HttpError = {
                            statusCode: status,
                            error: response,
                        };
                        return observer.error(juryRiggedError);
                    } else {
                        return observer.error(errorMessage);
                    }
                }
                // parse out the new user and set it
                const newUser: FrontendUser = JSON.parse(response);
                observer.next(newUser);
                observer.complete();
            };
            uploader.uploadAll();
        });
    }

    /**
     * Updates a user's tagline.
     *
     * @param tagline The new tagline
     */
    public updateTagline(tagline: UpdateTagline): Observable<FrontendUser> {
        return this.http
            .patch<FrontendUser>(`${this.url}/update-tagline`, tagline, { observe: 'response', withCredentials: true })
            .pipe(
                map((user) => {
                    return user.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    private tryParseJsonHttpError(response: string): HttpError | null {
        try {
            const error: HttpError = JSON.parse(response);
            return error;
        } catch (err) {
            return null;
        }
    }
}
