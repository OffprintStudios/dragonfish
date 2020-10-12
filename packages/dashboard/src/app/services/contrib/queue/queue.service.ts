import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Decision } from '@pulp-fiction/models/contrib';
import { PaginateResult } from '@pulp-fiction/models/util';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private url: string = `/api/dashboard/queue`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  /**
   * Gets the entire queue.
   */
  public getQueue(pageNum: number) {
    return this.http.get<PaginateResult<ApprovalQueue>>(`${this.url}/get-queue/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(entries => {
        return entries.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Gets the claimed works from one moderator.
   */
  public getQueueForMod(pageNum: number) {
    return this.http.get<PaginateResult<ApprovalQueue>>(`${this.url}/get-queue-for-mod/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(entries => {
        return entries.body;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Claims a work.
   * 
   * @param docId The document to claim
   */
  public claimWork(docId: string) {
    return this.http.patch(`${this.url}/claim-work/${docId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        return;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }))
  }

  /**
   * Approves a work.
   * 
   * @param decision Info about the decision.
   */
  public approveWork(decision: Decision) {
    return this.http.patch(`${this.url}/approve-work`, decision, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.snackBar.open(`Decision successfully submitted!`);
        return;
      }), catchError(err => {
        this.snackBar.open(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Rejects a work.
   * 
   * @param decision Info about the decision.
   */
  public rejectWork(decision: Decision) {
    return this.http.patch(`${this.url}/reject-work`, decision, {observe: 'response', withCredentials: true})
    .pipe(map(() => {
      this.snackBar.open(`Decision successfully submitted!`);
      return;
    }), catchError(err => {
      this.snackBar.open(`Something went wrong! Try again in a little bit.`);
      return throwError(err);
    }));
  }
}
