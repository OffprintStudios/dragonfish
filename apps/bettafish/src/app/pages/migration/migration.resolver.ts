import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MigrationModel } from './migration.model';
import { Work } from '@dragonfish/shared/models/works';
import { Blog } from '@dragonfish/shared/models/blogs';

@Injectable()
export class MigrationResolver implements Resolve<MigrationModel> {
    private url = `/api/migration`;

    constructor(private http: HttpClient) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<MigrationModel> {
        const userWorks = this.fetchAllWorks();
        const userBlogs = this.fetchAllBlogs();

        return zip(userWorks, userBlogs).pipe(map(val => {
            const migrationData: MigrationModel = {
                works: val[0],
                blogs: val[1]
            };

            return migrationData;
        }));
    }

    fetchAllWorks() {
        return this.http.get<Work[]>(`${this.url}/fetch-works`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    fetchAllBlogs() {
        return this.http.get<Blog[]>(`${this.url}/fetch-blogs`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
}
