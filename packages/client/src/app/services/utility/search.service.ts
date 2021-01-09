import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { InitialResults, PaginateResult } from '@pulp-fiction/models/util';
import { AlertsService } from '../../modules/alerts';
import { User } from '@pulp-fiction/models/users';
import { BlogsContentModel, ContentModel, ProseContent } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = `/api/search`

  workResults: Observable<PaginateResult<ContentModel>>;
  blogResults: Observable<PaginateResult<BlogsContentModel>>;
  userResults: Observable<PaginateResult<User>>;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }
  
  public getInitialResults(query: string): Observable<InitialResults> {
    return this.http.get<InitialResults>(`${this.url}/get-initial-results?query=${query}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getWorkResults(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
    return this.http.get<PaginateResult<ContentModel>>(`${this.url}/get-work-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getBlogResults(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
    return this.http.get<PaginateResult<ContentModel>>(`${this.url}/get-blog-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something with wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getUserResults(query: string, pageNum: number): Observable<PaginateResult<User>> {
    return this.http.get<PaginateResult<User>>(`${this.url}/get-user-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something with wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
