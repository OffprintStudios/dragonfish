import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PaginateResult } from '@dragonfish/models/util';
import { ContentModel, ContentKind } from '@dragonfish/models/content';
import { Section } from '@dragonfish/models/sections';
import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { Decision } from '@dragonfish/models/contrib';

@Injectable()
export class ApprovalQueueService {
    private url: string = `/api/approval-queue`;

    constructor(private http: HttpClient) { }
  
    /**
     * Gets the entire queue.
     */
    public getQueue(pageNum: number): Observable<PaginateResult<ApprovalQueue>> {
      return this.http.get<PaginateResult<ApprovalQueue>>(`${this.url}/get-queue/${pageNum}`, {observe: 'response', withCredentials: true})
        .pipe(map(entries => {
          return entries.body;
        }), catchError(err => {
          return throwError(err);
        }));
    }
  
    /**
     * Gets the claimed works from one moderator.
     */
    public getQueueForMod(pageNum: number): Observable<PaginateResult<ApprovalQueue>> {
      return this.http.get<PaginateResult<ApprovalQueue>>(`${this.url}/get-queue-for-mod/${pageNum}`, {observe: 'response', withCredentials: true})
        .pipe(map(entries => {
          return entries.body;
        }), catchError(err => {
          return throwError(err);
        }));
    }
  
    /**
     * Claims a work.
     * 
     * @param docId The document to claim
     */
    public claimWork(docId: string): Observable<ApprovalQueue> {
      return this.http.patch<ApprovalQueue>(`${this.url}/claim-work/${docId}`, {}, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }))
    }
  
    /**
     * Approves a work.
     * 
     * @param decision Info about the decision.
     */
    public approveWork(decision: Decision): Observable<void> {
      return this.http.patch(`${this.url}/approve-work`, decision, {observe: 'response', withCredentials: true})
        .pipe(map(() => {
          return;
        }), catchError(err => {
          return throwError(err);
        }));
    }
  
    /**
     * Rejects a work.
     * 
     * @param decision Info about the decision.
     */
    public rejectWork(decision: Decision): Observable<void> {
      return this.http.patch(`${this.url}/reject-work`, decision, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        return;
      }), catchError(err => {
        return throwError(err);
      }));
    }
  
    /**
     * Fetches a piece of content for viewing.
     * 
     * @param contentId The content ID
     * @param kind The content kind
     * @param userId The owner of the content
     */
    public viewContent(contentId: string, kind: ContentKind, userId: string): Observable<ContentModel> {
      return this.http.get<ContentModel>(`${this.url}/view-content?contentId=${contentId}&kind=${kind}&userId=${userId}`, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }))
    }
  
    /**
     * Fetches one section from the API using the provided `sectionID`.
     * 
     * @param sectionId The section ID
     */
    public fetchSection(sectionId: string): Observable<Section> {
      return this.http.get<Section>(`/api/content/sections/fetch-one-by-id?sectionId=${sectionId}&published=true`, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }));
    }
}