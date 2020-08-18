import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { History } from 'shared-models';
import { AlertsService } from 'src/app/modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private url = `/api/content/history`;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  /**
   * Fetches a user's entire history.
   */
  public fetchUserHistory() {
    return this.http.get<History[]>(`${this.url}/fetch-user-history`, {observe: 'response', withCredentials: true})
      .pipe(map(hist => {
        return hist.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Fetches one history doc without updating the viewedOn date.
   */
  public fetchOneHistDoc(workId: string) {
    return this.http.get<History>(`${this.url}/fetch-one-hist-doc/${workId}`, {observe: 'response', withCredentials: true})
      .pipe(map(hist => {
        return hist.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Adds a new history document, or updates an existing one.
   * 
   * @param workId The work to parse
   */
  public addOrUpdateHistory(workId: string) {
    return this.http.post<History>(`${this.url}/add-or-update-history/${workId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(hist => {
        return hist.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Soft deletes a history doc by setting its visibility to false.
   * 
   * @param workId The work to parse
   */
  public changeVisibility(workId: string) {
    return this.http.patch<void>(`${this.url}/change-item-visibility/${workId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Item successfully removed.`);
        return;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }
}
