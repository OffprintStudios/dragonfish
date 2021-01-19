import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FrontendUser, ChangeEmail } from '@pulp-fiction/models/users';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private url = `/api/auth`;

    constructor (private http: HttpClient, private snackBar: MatSnackBar) {}

    /**
     * Sends a request to change a user's email.
     * @param newEmail The requested new email and current password.
     */
    public changeEmail(newEmail: ChangeEmail): Observable<FrontendUser> {
        return this.http.patch<FrontendUser>(`${this.url}/change-email`, newEmail, { observe: 'response', withCredentials: true })
            .pipe(map(user => {
                return user.body;
            }), catchError(err => {
                this.snackBar.open(err.error.message);
                return throwError(err);
            }));
    }
}