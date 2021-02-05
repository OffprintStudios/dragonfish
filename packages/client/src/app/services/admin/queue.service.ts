import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { AlertsService } from '../../shared/alerts';

@Injectable({
    providedIn: 'root',
})
export class QueueService {
    private url: string = `${environment.apiUrl}/api/dashboard/queue`;

    constructor(private http: HttpClient, private alertsService: AlertsService) {}

    /**
     * Submits a work to the queue.
     *
     * @param workId The work to submit
     */
    submitWork(workId: string) {
        return this.http
            .post(`${this.url}/submit-work/${workId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    this.alertsService.success(`Work successfully submitted!`);
                    return;
                }),
                catchError((err) => {
                    if (err.error.message) {
                        this.alertsService.error(`HTTP ${err.status}: ${err.error.message}`);
                    } else {
                        this.alertsService.error(
                            `Something went wrong! Try again in a little bit.\nDetails: HTTP ${err.status}`,
                        );
                    }
                    return throwError(err);
                }),
            );
    }
}
