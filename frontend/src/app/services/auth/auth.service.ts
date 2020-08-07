import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';

import { User, CreateUser, LoginUser, ChangeNameAndEmail, ChangePassword, ChangeProfile } from 'src/app/models/users';
import { AlertsService } from 'src/app/modules/alerts';
import { HttpError } from 'src/app/models/site';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currUserSubject: BehaviorSubject<User>;
  public currUser: Observable<User>;
  private url: string = `/api/auth`;

  constructor(private http: HttpClient, private router: Router, private alertsService: AlertsService) {
    this.currUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currUser = this.currUserSubject.asObservable();
  }

  /**
   * Gets the current user value from the user subject.
   */
  public getCurrUserValue(): User {
    return this.currUserSubject.value;
  }

  /* Authorization */

  /**
   * Sends a new user's info to the backend. If the response is successful,
   * the `user` is returned and their info is set in local storage. Otherwise,
   * sends the backend error to all subscribed observables.
   *
   * @param credentials A user's credentials.
   */
  public register(credentials: CreateUser): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, credentials, { observe: 'response', withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        this.router.navigate(['/home']).then(() => {
          location.reload();
        });
        return user.body;
      }), catchError(err => {
        console.log(err);
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
  public login(credentials: LoginUser): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, credentials, { withCredentials: true, observe: 'response' })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        this.router.navigate(['/home']).then(() => {
          location.reload();
        });
        return user.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Refreshes the current user token with new User info.
   * If refresh fails, 
   */
  public refreshToken(): Observable<string | null> {
    return this.http.get<User>(`${this.url}/refresh-token`, { observe: 'response', withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        return user.body.token;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Logs the user out, sets the user object to null, removes their info from localStorage, and
   * navigates to home.
   */
  public logout(): void {
    // Fire and forget. If this fails, it doesn't matter to the user, 
    // and we don't want to leak that fact anyway.
    this.http.get(`${this.url}/logout`, { withCredentials: true }).subscribe();

    localStorage.removeItem('currentUser');
    this.currUserSubject.next(null);
    this.alertsService.success('See you next time!');
    this.router.navigate(['/home/latest']);    
  }

  /* Account settings */

  /**
   * Sends a request to change a user's username and email.
   * 
   * @param newNameAndEmail The new name and email requested
   */
  public changeNameAndEmail(newNameAndEmail: ChangeNameAndEmail) {
    return this.http.patch<User>(`${this.url}/change-name-and-email`, newNameAndEmail, { observe: 'response', withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        return user.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Sends a request to change a user's password.
   * 
   * @param newPasswordInfo The new password requested
   */
  public changePassword(newPasswordInfo: ChangePassword) {
    return this.http.patch<User>(`${this.url}/change-password`, newPasswordInfo, { observe: 'response', withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        return user.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Sends a request to change a user's profile.
   * 
   * @param newProfileInfo The new profile info requested
   */
  public changeProfile(newProfileInfo: ChangeProfile) {
    return this.http.patch<User>(`${this.url}/update-profile`, newProfileInfo, { observe: 'response', withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user.body));
        this.currUserSubject.next(user.body);
        return user.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Uploads a user's avatar to the server for processing.
   * 
   * @param uploader the file uploader
   */
  public changeAvatar(uploader: FileUploader): Observable<User> {
    return new Observable<User>(observer => {
      uploader.onCompleteItem = (_: FileItem, response: string, status: number, __: ParsedResponseHeaders) => {

        if (status !== 201) {
          const error: HttpError = JSON.parse(response);
          return observer.error(error);
        }

        // parse out the new user and set it
        const newUser: User = JSON.parse(response);
        localStorage.setItem('currentUser', response);
        this.currUserSubject.next(newUser);
        observer.next(newUser);
      };

      uploader.uploadAll();
    });
  }
}