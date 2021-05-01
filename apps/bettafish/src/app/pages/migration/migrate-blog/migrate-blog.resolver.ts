import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Blog } from '@dragonfish/shared/models/blogs';

@Injectable()
export class MigrateBlogResolver implements Resolve<Blog> {
    private url = `/api/migration`;

    constructor(private http: HttpClient) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Blog> {
        const blogId = route.paramMap.get('blogId');

        return this.grabOneBlog(blogId);
    }

    grabOneBlog(blogId: string) {
        return this.http.get<Blog>(`${this.url}/fetch-one-blog?blogId=${blogId}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
}
