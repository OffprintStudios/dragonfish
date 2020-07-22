import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    /**
     * Intercepts all outgoing requests to the backend and sets an Authorization header
     * on each one.
     * 
     * @param req The outgoing request
     * @param next Passes the request along to the next handler
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authService.getCurrUserValue();
        if (currentUser && currentUser.token) {
            if (currentUser.token === null) {
                return next.handle(req);
            } else {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        return next.handle(req);
    }
}
