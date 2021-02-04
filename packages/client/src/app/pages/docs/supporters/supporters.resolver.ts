import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Work } from '@dragonfish/models/works';
import { Blog } from '@dragonfish/models/blogs';
import { FrontendUser } from '@dragonfish/models/users';

@Injectable()
export class SupportersResolver implements Resolve<FrontendUser[]> {
    private url = `/api/admin`;

    constructor(private http: HttpClient) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<FrontendUser[]> {
        return this.getSupporters();
    }

    getSupporters() {
        return this.http.get<FrontendUser[]>(`${this.url}/supporters`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
}