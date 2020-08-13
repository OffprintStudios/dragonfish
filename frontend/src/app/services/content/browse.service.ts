import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from 'src/app/modules/alerts';

import { Work } from 'shared-models';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {
  private url: string = `/api/browse`;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  /**
   * Gets **all** published works and returns them in one big honkin' array.
   */
  public fetchAllPublishedWorks(): Observable<Work[]> {
    return this.http.get<Work[]>(`${this.url}/all-pub-works`, {observe: 'response'})
      .pipe(map(res => {
        if (res.status === 200) {
          return res.body;
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
