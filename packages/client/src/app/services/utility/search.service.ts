import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PaginateResult } from '@pulp-fiction/models/util';
import { InitialResults } from './models';
import { AlertsService } from '../../modules/alerts';
import { Work } from '@pulp-fiction/models/works';
import { Blog } from '@pulp-fiction/models/blogs';
import { User } from '@pulp-fiction/models/users';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = `/api/search`

  constructor(private http: HttpClient, private alertsService: AlertsService) { }
  
  public getInitialResults(query: string) {
    return this.http.get<InitialResults>(`${this.url}/get-initial-results?query=${query}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getWorkResults(query: string, pageNum: number) {
    return this.http.get<PaginateResult<Work>>(`${this.url}/get-work-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getBlogResults(query: string, pageNum: number) {
    return this.http.get<PaginateResult<Blog>>(`${this.url}/get-blog-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something with wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public getUserResults(query: string, pageNum: number) {
    return this.http.get<PaginateResult<User>>(`${this.url}/get-user-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something with wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
