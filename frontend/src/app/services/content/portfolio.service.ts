import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from 'src/app/models/users';
import { Blog } from 'shared-imports';
import { Work } from 'src/app/models/works';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private url: string = `/api/content/portfolio`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches the user whose portfolio the request belongs to.
   * 
   * @param userId The user ID of a requested portfolio
   */
  public getUserInfo(userId: string) {
    return this.http.get<User>(`${this.url}/get-user-info/${userId}`, {observe: 'response', withCredentials: true})
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
    return this.http.get<Blog[]>(`${this.url}/get-blogs-list/${userId}`, {observe: 'response', withCredentials: true})
    .pipe(map(blogs => {
      return blogs.body.reverse();
    }), catchError(err => {
      return throwError(err);
    }));
  }

  /**
   * Fetches a user's published works for display in their portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   */
  public getWorksList(userId: string) {
    return this.http.get<Work[]>(`${this.url}/get-works-list/${userId}`, {observe: 'response', withCredentials: true})
      .pipe(map(works => {
        return works.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches a published blog from the database given its ID.
   * 
   * @param blogId The blog we're fetching
   */
  public getBlog(blogId: string) {
    return this.http.get<Blog>(`${this.url}/get-blog/${blogId}`, {observe: 'response', withCredentials: true})
      .pipe(map(blog => {
        return blog.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
