import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsContentModel } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private url = `/api/content/news`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  /**
   * Fetches a page of news results.
   * 
   * @param pageNum The current page
   */
  public getNewsFeed(pageNum: number) {
    return this.http.get<PaginateResult<NewsContentModel>>(`${this.url}/news-feed/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`${err.error.message}`);
        return throwError(err);
      }));
  }

  /**
   * Grabs one newspost from the database.
   * 
   * @param postId The post to fetch
   */
  public getNewsPost(postId: string) {
    return this.http.get<NewsContentModel>(`${this.url}/news-post/${postId}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`${err.error.message}`);
        return throwError(err);
      }));
  }
}
