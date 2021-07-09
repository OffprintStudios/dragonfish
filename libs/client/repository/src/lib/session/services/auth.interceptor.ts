import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { SessionQuery } from '../session.query';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private sessionQuery: SessionQuery, private auth: AuthService) {}

    /**
     * Intercepts all outgoing requests to the backend and sets an Authorization header
     * on each one.
     *
     * @param req The outgoing request
     * @param next Passes the request along to the next handler
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.sessionQuery.token;
        if (token === null) {
            return next.handle(req);
        }

        req = this.addToken(req, token);
        return next.handle(req).pipe(
            catchError((error) => {
                // If this was a 401, refresh and try again before failing out.
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.tryRefresh(req, next);
                } else {
                    return throwError(error);
                }
            }),
        );
    }

    private tryRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isRefreshing === true) {
            // Sit and wait for the refresh attempt currently in-progress.
            return this.refreshTokenSubject.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap((jwt) => {
                    return next.handle(this.addToken(req, jwt));
                }),
            );
        }

        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.auth.refreshToken().pipe(
            switchMap(() => {
                const token = this.sessionQuery.token;
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token);
                return next.handle(this.addToken(req, token));
            })
        )
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
