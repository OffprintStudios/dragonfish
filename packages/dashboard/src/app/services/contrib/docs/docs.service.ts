import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as lodash from 'lodash';

import { Doc, CreateDoc, EditDoc } from '@pulp-fiction/models/docs';
import { Roles } from '@pulp-fiction/models/users';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private url = `/api/dashboard/docs`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   * Sends a new document to the backend.
   * 
   * @param userRoles The user's roles array
   * @param docInfo The document info
   */
  public createDoc(userRoles: Roles[], docInfo: CreateDoc) {
    const requiredRole: Roles[] = [Roles.Admin];
    const hasRoles = lodash.intersection(userRoles, requiredRole);
    if (hasRoles.length > 0) {
      return this.http.put(`${this.url}/create-doc`, docInfo, {observe: 'response', withCredentials: true})
        .pipe(map(() => {
          this.snackBar.open(`Document added to database.`);
        }), catchError(err => {
          this.snackBar.open(err.error.message);
          return throwError(err);
        }))
    } else {
      this.snackBar.open(`You don't have permission to create site docs.`);
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
        this.snackBar.open(err.error.message);
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
        this.snackBar.open(err.error.message);
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
        this.snackBar.open(`Edits successfully saved.`);
      }), catchError(err => {
        this.snackBar.open(err.error.message);
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
        this.snackBar.open(`Doc successfully deleted.`);
      }), catchError(err => {
        this.snackBar.open(err.error.message);
        return throwError(err);
      }));
  }
}