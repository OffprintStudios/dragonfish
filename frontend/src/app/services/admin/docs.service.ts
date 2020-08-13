import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AlertsService } from 'src/app/modules/alerts';
import { Doc, CreateDoc, EditDoc } from 'src/app/models/admin/docs';
import { Roles } from 'src/app/models/users';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private url = `/api/contrib/docs`;

  constructor(private http: HttpClient, private alertsService: AlertsService) {}

  /**
   * Sends a new document to the backend.
   * 
   * @param userRoles The user's roles array
   * @param docInfo The document info
   */
  public createDoc(userRoles: Roles[], docInfo: CreateDoc) {
    if (userRoles.includes(Roles.Admin)) {
      return this.http.put(`${this.url}/create-doc`, docInfo, {observe: 'response', withCredentials: true})
        .pipe(map(() => {
          this.alertsService.success(`Document added to database.`);
        }), catchError(err => {
          this.alertsService.error(err.error.message);
          return throwError(err);
        }))
    } else {
      this.alertsService.error(`You don't have permission to create site docs.`);
    }
  }

  /**
   * Fetches docs for the dashboard
   */
  public fetchForDashboard() {
    return this.http.get<Doc[]>(`${this.url}/fetch-for-dashboard`, {observe: 'response', withCredentials: true})
      .pipe(map(docs => {
        return docs.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Fetches a doc for editing.
   * 
   * @param docId The doc to fetch
   */
  public fetchForEdit(docId: string) {
    return this.http.get<Doc>(`${this.url}/fetch-one-for-edits/${docId}`, {observe: 'response', withCredentials: true})
      .pipe(map(doc => {
        return doc.body;
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Fetches a doc for display on a document page
   * @param docId The doc to fetch
   */
  public fetchOne(docId: string) {
    return this.http.get<Doc>(`${this.url}/fetch-one/${docId}`, {observe: 'response', withCredentials: true})
      .pipe(map(doc => {
        return doc.body;
      }), catchError(err => {
        this.alertsService.error(`The doc you're looking for can't be found.`);
        return throwError(err);
      }));
  }

  /**
   * Sends a doc's edits to the backend.
   * 
   * @param docInfo The doc to edit
   */
  public editDoc(docInfo: EditDoc) {
    return this.http.patch(`${this.url}/edit-doc`, docInfo, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Edits successfully saved.`);
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }

  /**
   * Deletes a document from the database.
   * 
   * @param docId The doc to delete
   */
  public deleteDoc(docId: string) {
    return this.http.patch(`${this.url}/delete-doc/${docId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Doc successfully deleted.`);
      }), catchError(err => {
        this.alertsService.error(err.error.message);
        return throwError(err);
      }));
  }
}
