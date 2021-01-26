import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { FrontPageStats } from '@pulp-fiction/models/stats';
import { AlertsService } from '../../shared/alerts';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private url = `/api/admin/stats`;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  /**
   * Fetches the stats for the footer.
   */
  public fetchFrontPageStats() {
    return this.http.get<FrontPageStats>(`${this.url}/front-page-stats`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Error retrieving frontpage stats.`);
        return throwError(err);
      }));
  }
}
