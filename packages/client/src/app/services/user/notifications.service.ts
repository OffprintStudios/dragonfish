import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EventSourcePolyfill } from 'ng-event-source';
import { Select } from '@ngxs/store';
import { UserState } from '../../shared/user';
import { environment } from '../../../environments/environment';

import { NotificationBase, MarkReadRequest, NotificationSubscription } from '@dragonfish/models/notifications';
import { FrontendUser } from '@dragonfish/models/users';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    @Select(UserState.currUser) private currentUser$: Observable<FrontendUser>;
    private currentUserSubscription: Subscription;
    private currentUser: FrontendUser;

    private url = `${environment.apiUrl}/api/notifications`;

    constructor(private http: HttpClient, private zone: NgZone) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }

    public getNotificationStream(): Observable<any> {
        return new Observable((observer) => {
            const eventSource = new EventSourcePolyfill(`${this.url}/sse`, {
                headers: { Authorization: 'Bearer ' + this.currentUser.token },
            });

            eventSource.onmessage = (event) => {
                this.zone.run(() => {
                    observer.next(event);
                });
            };

            eventSource.onerror = (error) => {
                this.zone.run(() => {
                    observer.error(error);
                });
            };
        });
    }

    public getAllNotifications(): Observable<NotificationBase[]> {
        return this.http
            .get<NotificationBase[]>(`${this.url}/all-notifications`, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public getUnreadNotifications(): Observable<NotificationBase[]> {
        return this.http
            .get<NotificationBase[]>(`${this.url}/unread-notifications`, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public markAsRead(toMark: MarkReadRequest): Observable<void> {
        return this.http
            .post<void>(`${this.url}/mark-as-read`, toMark, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public getSubscriptions(): Observable<NotificationSubscription[]> {
        return this.http
            .get<NotificationSubscription[]>(`${this.url}/unread-notifications`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public subscribe(sourceId: string): Observable<void> {
        return this.http
            .post<void>(
                `${this.url}/subscribe?sourceId=${sourceId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map((res) => {
                    return;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public unsubscribe(sourceId: string): Observable<void> {
        return this.http
            .post<void>(
                `${this.url}/unsubscribe?sourceId=${sourceId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map((res) => {
                    return;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }
}
