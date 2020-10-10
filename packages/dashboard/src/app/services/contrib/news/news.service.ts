import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsPost, PostForm } from '@pulp-fiction/models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private url = `/api/contrib/news`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  /**
   * Creates and saves a new newspost to the database.
   * 
   * @param form A newspost's info
   */
  public createNewspost(form: PostForm) {
    return this.http.post<NewsPost>(`${this.url}/create-newspost`, form, {observe: 'response', withCredentials: true})
      .pipe(map(_res => {
        this.snackBar.open(`Post created successfully!`);
        return;
      }), catchError(err => {
        this.snackBar.open(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Submits edits on a newspost to the database.
   * 
   * @param form A newspost's info
   */
  public editNewspost(form: PostForm) {
    return this.http.patch<NewsPost>(`${this.url}/edit-newspost`, form, {observe: 'response', withCredentials: true})
      .pipe(map(_res => {
        this.snackBar.open(`Changed saved!`);
        return;
      }), catchError(err => {
        this.snackBar.open(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Fetches all newsposts
   */
  public fetchAll() {
    return this.http.get<PaginateResult<NewsPost>>(`${this.url}/fetch-all`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(err.error.message);
        return throwError(err);
      }));
  }
}
