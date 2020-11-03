import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PoetryContent, CreatePoetry } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private url = `/api/content/poetry`;

  constructor(private http: HttpClient) { }

  public createPoetry(poetryInfo: CreatePoetry) {
    return this.http.put<PoetryContent>(`${this.url}/create-poetry`, poetryInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public editPoetry(contentId: string, poetryInfo: CreatePoetry) {
    return this.http.patch<void>(`${this.url}/edit-poetry?contentId=${contentId}`, poetryInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
