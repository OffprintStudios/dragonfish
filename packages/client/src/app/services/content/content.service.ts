import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ContentKind, ContentModel, SectionInfo } from '@pulp-fiction/models/content';
import { Section } from '@pulp-fiction/models/sections';
import { PaginateResult } from '@pulp-fiction/models/util';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private url = `/api/content`;
  public publishedSections: SectionInfo[];

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

  public fetchAllPublished(pageNum: number, kind: ContentKind[], userId?: string): Observable<PaginateResult<ContentModel>> {
    let route = `${this.url}`;

    // If we just include the kind array as-is, it'll be serialized as "&kind=Kind1,Kind2" which the backend will interpret as
    // the string 'Kind1,Kind2' which is not what we want. So, we manually split it out into a query string
    const kindFragment = kind.map(k => `&kind=${k}`).join('');
    if (userId) {
      route = `${this.url}/fetch-all-published?pageNum=${pageNum}&userId=${userId}${kindFragment}`;
    } else {
      route = `${this.url}/fetch-all-published?pageNum=${pageNum}${kindFragment}`;
    }    

    return this.http.get<any>(route, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public fetchOneSection(sectionId: string) {
    return this.http.get<Section>(`${this.url}/sections/fetch-one-by-id?sectionId=${sectionId}&published=true`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong fetching this section. Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
