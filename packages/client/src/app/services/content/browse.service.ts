import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from '../../modules/alerts';

import { Work } from '@pulp-fiction/models/works';
import { map, catchError } from 'rxjs/operators';
import { PaginateResult } from '@pulp-fiction/models/util';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {
  private url: string = `/api/browse`;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  /**
   * Gets **all** published works and returns them in one big honkin' array.
   */
  public fetchAllPublishedWorks(pageNum: number): Observable<PaginateResult<Work>> {
    return this.http.get<PaginateResult<Work>>(`${this.url}/all-pub-works/${pageNum}`, {observe: 'response'})
      .pipe(map(res => {
        if (res.status === 200) {
          return res.body;
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
