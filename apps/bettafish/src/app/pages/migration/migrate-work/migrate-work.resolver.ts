import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Work } from '@dragonfish/shared/models/works';

@Injectable()
export class MigrateWorkResolver implements Resolve<Work> {
    private url = `/api/migration`;

    constructor(private http: HttpClient) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Work> {
        const workId = route.paramMap.get('workId');

        return this.grabOneWork(workId);
    }

    grabOneWork(workId: string) {
        return this.http.get<Work>(`${this.url}/fetch-one-work?workId=${workId}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
}
