import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AlertsService } from 'src/app/modules/alerts';
import { ApprovalQueue, Decision } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private url: string = `/api/contrib`;

  constructor(private http: HttpClient, private alertsService: AlertsService) { }

  /**
   * Submits a work to the queue.
   * 
   * @param workId The work to submit
   */
  submitWork(workId: string) {
    return this.http.post(`${this.url}/submit-work/${workId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        this.alertsService.success(`Work successfully submitted!`);
        return;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }))
  }

  /**
   * Gets the entire queue.
   */
  public getQueue() {
    return this.http.get<ApprovalQueue[]>(`${this.url}/queue`, {observe: 'response', withCredentials: true})
      .pipe(map(entries => {
        return entries.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }

  /**
   * Gets the claimed works from one moderator.
   */
  public getQueueForMod() {
    return this.http.get<ApprovalQueue[]>(`${this.url}/queue-for-mod`, {observe: 'response', withCredentials: true})
      .pipe(map(entries => {
        return entries.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
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
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
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
        this.alertsService.success(`Decision successfully submitted!`);
        return;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
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
      this.alertsService.success(`Decision successfully submitted!`);
      return;
    }), catchError(err => {
      this.alertsService.error(`Something went wrong! Try again in a little bit.`);
      return throwError(err);
    }));
  }
}
