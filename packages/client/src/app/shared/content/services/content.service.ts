import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ContentModel, ContentKind } from '@pulp-fiction/models/content';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private url = `/api/content`;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    /**
     * Fetches one piece of content from the API.
     * 
     * @param contentId The content ID
     * @param kind The content kind
     */
    public fetchOne(contentId: string, kind: ContentKind) {
        return this.http.get<ContentModel>(`${this.url}/fetch-one-published?contentId=${contentId}&kind=${kind}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
                return throwError(err);
            }));
    }
}