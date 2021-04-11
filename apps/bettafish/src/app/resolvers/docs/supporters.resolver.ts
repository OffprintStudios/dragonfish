import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FrontendUser } from '@dragonfish/shared/models/users';

@Injectable()
export class SupportersResolver implements Resolve<FrontendUser[]> {
    private url = `/api/meta`;

    constructor(private http: HttpClient) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<FrontendUser[]> {
        return this.getSupporters();
    }

    getSupporters() {
        return this.http
            .get<FrontendUser[]>(`${this.url}/supporters`, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }
}
