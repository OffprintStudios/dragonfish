import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as lodash from 'lodash';

import { AlertsService } from '../../shared/alerts';
import { Doc } from '@dragonfish/models/docs';

@Injectable({
    providedIn: 'root',
})
export class DocsService {
    private url = `/api/dashboard/docs`;

    constructor(private http: HttpClient, private alertsService: AlertsService) {}

    /**
     * Fetches a doc for display on a document page
     * @param docId The doc to fetch
     */
    public fetchOne(docId: string) {
        return this.http
            .get<Doc>(`${this.url}/fetch-one/${docId}`, { observe: 'response', withCredentials: true })
            .pipe(
                map((doc) => {
                    return doc.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`The doc you're looking for can't be found.`);
                    return throwError(err);
                }),
            );
    }
}
