import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from 'src/app/models/users';
import { Blog } from 'src/app/models/blogs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches the user whose portfolio the request belongs to.
   * 
   * @param userId The user ID of a requested portfolio
   */
  public getUserInfo(userId: string) {
    return this.http.get<User>(`/api/content/portfolio/get-user-info/id?id=` + userId, {observe: 'response', withCredentials: true})
      .pipe(map(user => {
        return user.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches a user's published blogs for display in their portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   */
  public getBlogList(userId: string) {
    return this.http.get<Blog[]>(`/api/content/portfolio/get-blogs-list/id?id=` + userId, {observe: 'response', withCredentials: true})
    .pipe(map(blogs => {
      return blogs.body;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  /*getWorksList(id: number) {
    return this.http.get<Work[]>(`/api/content/portfolio/get-works-list/id?id=` + id, {observe: 'response', withCredentials: true})
      .pipe(map(works => {
        return works.body.data;
      }), catchError(err => {
        return throwError(err);
      }))
  }*/
}
