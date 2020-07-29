import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as models from 'src/app/models/works';
import { AlertsService } from 'src/app/modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class WorksService {
  constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) { }

  /**
   * Sends the requisite work info to the backend so that a new work can
   * be created.
   * 
   * @param info The work's information
   */
  public createWork(info: models.CreateWork) {
    return this.http.put<models.Work>(`/api/content/works/create-work`, info, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 201) {
          this.alertsService.success(`Work successfully created.`);
        }
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Fetches a user's works for display in the work management section of
   * the homepage.
   */
  public fetchUserWorks() {
    return this.http.get<models.Work[]>(`/api/content/works/fetch-user-works`, {observe: 'response', withCredentials: true})
      .pipe(map(works => {
        return works.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Sends a request to the backend to delete the specified work using its ID.
   * 
   * @param workId The work we're deleting
   */
  public deleteWork(workId: string) {
    return this.http.patch(`/api/content/works/delete-work/` + workId, {}, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        this.alertsService.success(`Work successfully deleted.`);
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  public submitForPublishing() {

  }

  /**
   * Sends a request to the backend to update work with the specified new information.
   * 
   * @param workInfo The work we're editing
   */
  public editWork(workInfo: models.EditWork) {
    return this.http.patch(`/api/content/works/edit-work`, workInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        this.alertsService.success(`Changes saved successfully.`);
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
