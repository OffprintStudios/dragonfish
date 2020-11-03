import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ProseContent, CreateProse } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class ProseService {
  private url = `/api/content/prose`;

  constructor(private http: HttpClient) { }

  public createProse(proseInfo: CreateProse) {
    return this.http.put<ProseContent>(`${this.url}/create-prose`, proseInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public editProse(contentId: string, proseInfo: CreateProse) {
    return this.http.patch<void>(`${this.url}/edit-prose?contentId=${contentId}`, proseInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
