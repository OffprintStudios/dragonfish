import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ContentKind } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private url: `/api/content`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  public fetchOnePublished(contentId: string, kind: ContentKind) {
    return this.http.get<any>(`${this.url}/fetch-one-published?contentId=${contentId}&kind=${kind}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public fetchAllPublished(pageNum: number, kind: ContentKind, userId?: string) {
    let route = `${this.url}`;

    if (userId) {
      route = `${this.url}/fetch-all-published?pageNum=${pageNum}&userId=${userId}&kind=${kind}`;
    } else {
      route = `${this.url}/fetch-all-published?pageNum=${pageNum}&kind=${kind}`;
    }

    return this.http.get<any>(route, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
