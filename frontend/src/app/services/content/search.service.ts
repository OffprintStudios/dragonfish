import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AlertsService } from 'src/app/modules/alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = `/api/search`

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  public testQueries(query: string, pageNum: number) {
    return this.http.get(`${this.url}/find-results?query=${query}&pageNum=${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
