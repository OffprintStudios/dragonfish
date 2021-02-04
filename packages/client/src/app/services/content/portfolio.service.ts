import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Blog } from '@dragonfish/models/blogs';
import { Work } from '@dragonfish/models/works';
import { FrontendUser } from '@dragonfish/models/users';
import { PaginateResult } from '@dragonfish/models/util';
import { Collection } from '@dragonfish/models/collections';

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
    return this.http.get<FrontendUser>(`${this.url}/get-user-info/${userId}`, {observe: 'response', withCredentials: true})
      .pipe(map(user => {
        return user.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches a user's published blogs for display on their portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   */
  public getBlogList(userId: string, pageNum: number) {
    return this.http.get<PaginateResult<Blog>>(`${this.url}/get-blogs-list/${userId}/${pageNum}`, {observe: 'response', withCredentials: true})
    .pipe(map(blogs => {
      return blogs.body;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  /**
   * Fetches a user's published works for display on their portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   */
  public getWorksList(userId: string, pageNum: number) {
    return this.http.get<PaginateResult<Work>>(`${this.url}/get-works-list/${userId}/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(works => {
        return works.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches a user's public collections for display on their portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   */
  public getCollectionsList(userId: string, pageNum: number) {
    return this.http.get<PaginateResult<Collection>>(`${this.url}/get-port-collections/${userId}/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(colls => {
        return colls.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches the specified public collection for display on a user's portfolio.
   * 
   * @param userId The user ID of the requested portfolio
   * @param collId The collection to fetch
   */
  public getOneCollection(userId: string, collId: string) {
    return this.http.get<Collection>(`${this.url}/get-one-collection/${userId}/${collId}`, {observe: 'response', withCredentials: true})
      .pipe(map(coll => {
        return coll.body;
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
