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
  private url: string = `/api/content/works`;

  constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) { }

  /**
   * Sends the requisite work info to the backend so that a new work can
   * be created.
   * 
   * @param info The work's information
   */
  public createWork(info: models.CreateWork) {
    return this.http.put<models.Work>(`${this.url}/create-work`, info, {observe: 'response', withCredentials: true})
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
   * Creates a section belonging to the specified work.
   * 
   * @param workId The work the section belongs to
   * @param info The new section's information
   */
  public createSection(workId: string, info: models.CreateSection) {
    return this.http.put<models.Section>(`${this.url}/create-section/${workId}`, info, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        this.alertsService.success(`Section successfully created.`);
        return res.body._id;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Fetches a section belonging to the specified work for an author to view it.
   * 
   * @param workId The work the section belongs to
   * @param sectionId The section itself
   */
  public getSectionForUser(workId: string, sectionId: string) {
    return this.http.get<models.Section>(`${this.url}/get-section-for-user/${workId}/${sectionId}`, {observe: 'response', withCredentials: true})
      .pipe(map(section => {
        return section.body;
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
    return this.http.get<models.Work[]>(`${this.url}/fetch-user-works`, {observe: 'response', withCredentials: true})
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
    return this.http.patch(`${this.url}/delete-work/${workId}`, {}, {observe: 'response', withCredentials: true})
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
    return this.http.patch(` ${this.url}/edit-work`, workInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        this.alertsService.success(`Changes saved successfully.`);
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Fetches a work from the database using its ID.
   * 
   * @param workId The work we're fetching
   */
  public fetchWork(workId: string) {
    return this.http.get<models.Work>(`${this.url}/get-work/${workId}`, {observe: 'response', withCredentials: true})
      .pipe(map(work => {
        return work.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Sends the provided information to the backend to update the requisite section of
   * the specified work.
   * 
   * @param workId The work this section belongs to
   * @param sectionId The section itself
   * @param sectionData The new information for the section
   */
  public editSection(workId: string, sectionId: string, sectionData: models.EditSection) {
    return this.http.patch(`${this.url}/edit-section/${workId}/${sectionId}`, sectionData, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Changes saved!`);
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Sets the publishing status of the specified section, belonging to the specified work.
   * 
   * @param workId The work this section belongs to
   * @param sectionId The section itself
   * @param pubStatus The new publishing status for this section
   */
  public setPublishStatusSection(workId: string, sectionId: string, pubStatus: models.PublishSection) {
    return this.http.patch(`${this.url}/set-publishing-status/${workId}/${sectionId}`, pubStatus, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Section published successfully!`);
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
