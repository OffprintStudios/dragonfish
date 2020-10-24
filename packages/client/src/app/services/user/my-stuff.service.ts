import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContentModel } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class MyStuffService {
  private url = `/api/content`;

  constructor(private http: HttpClient) { }

  public fetchAll() {
    return this.http.get<ContentModel[]>(`${this.url}/fetch-all`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
