import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ContentModel, ContentKind, SetRating } from '@pulp-fiction/models/content';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Section } from '@pulp-fiction/models/sections';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private url = `/api/content`;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    /**
     * Fetches one piece of published content from the API.
     * 
     * @param contentId The content ID
     * @param kind The content kind
     */
    public fetchOne(contentId: string, kind: ContentKind): Observable<ContentModel> {
        return this.http.get<ContentModel>(`${this.url}/fetch-one-published?contentId=${contentId}&kind=${kind}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
                return throwError(err);
            }));
    }

    /**
     * Finds a related history document, provided the `contentId`. Creates one if none exist, or
     * updates an existing one if something is found.
     * 
     * @param contentId The related content
     */
    public fetchRelatedHistory(contentId: string) {
        return this.http.post<ReadingHistory>(`${this.url}/history/add-or-update-history/${contentId}`, {}, {observe: 'response', withCredentials: true})
            .pipe(map(hist => {
                return hist.body;
            }), catchError(err => {
                this.snackBar.open(err.error.message);
                return throwError(err);
            }));
    }

    /**
     * Fetches all published content from the API that matches the provided `kinds`. Optionally filters
     * the results by a provided `userId`.
     * 
     * @param pageNum The current page
     * @param kinds The kinds of content to include
     * @param userId (Optional) The author of this content
     */
    public fetchAll(pageNum: number, kinds: ContentKind[], userId?: string): Observable<PaginateResult<ContentModel>> {
        let route = `${this.url}`;

        // If we just include the kind array as-is, it'll be serialized as "&kind=Kind1,Kind2" which the backend will interpret as
        // the string 'Kind1,Kind2' which is not what we want. So, we manually split it out into a query string
        const kindFragment = kinds.map(k => `&kind=${k}`).join('');
        if (userId) {
            route = `${this.url}/fetch-all-published?pageNum=${pageNum}&userId=${userId}${kindFragment}`;
        } else {
            route = `${this.url}/fetch-all-published?pageNum=${pageNum}${kindFragment}`;
        }  

        return this.http.get<PaginateResult<ContentModel>>(route, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
                return throwError(err);
            }));
    }

    /**
     * Fetches one section from the API using the provided `sectionID`.
     * 
     * @param sectionId The section ID
     */
    public fetchSection(sectionId: string): Observable<Section> {
        return this.http.get<Section>(`${this.url}/sections/fetch-one-by-id?sectionId=${sectionId}&published=true`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong fetching this section. Try again in a little bit.`);
                return throwError(err);
            }));
    }

    /**
     * Sets a user's rating to Liked.
     * 
     * @param setRating Information to set the new rating
     */
    public setLike(setRating: SetRating): Observable<ReadingHistory> {
        return this.http.patch<ReadingHistory>(`${this.url}/set-like`, setRating, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(err.error.message);
                return throwError(err);
            }));
    }

    /**
     * Sets a user's rating to Disliked.
     * 
     * @param setRating Information to set the new rating
     */
    public setDislike(setRating: SetRating): Observable<ReadingHistory> {
        return this.http.patch<ReadingHistory>(`${this.url}/set-dislike`, setRating, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(err.error.message);
                return throwError(err);
            }));
    }

    /**
     * Sets a user's rating to NoVote.
     * 
     * @param setRating Information to set the new rating
     */
    public setNoVote(setRating: SetRating): Observable<ReadingHistory> {
        return this.http.patch<ReadingHistory>(`${this.url}/set-no-vote`, setRating, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(err.error.message);
                return throwError(err);
            }));
    }
}