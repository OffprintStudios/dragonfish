import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EventSourcePolyfill } from 'ng-event-source';
import { Select } from '@ngxs/store';
import { UserState } from '../../shared/user';
import { environment } from '../../../environments/environment';

import { NotificationBase, MarkReadRequest, NotificationSubscription } from '@dragonfish/models/notifications';
import { FrontendUser } from '@dragonfish/models/users';
import { NetworkService } from '../network.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    @Select(UserState.currUser) private currentUser$: Observable<FrontendUser>;
    private currentUserSubscription: Subscription;
    private currentUser: FrontendUser;

    private url = `${environment.apiUrl}/api/notifications`;

    constructor(private networkService: NetworkService, private zone: NgZone) {
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

    /**
     * Gets all of the current user's notifications.
     */
    public getAllNotifications(): Observable<NotificationBase[]> {
        return this.networkService.fetchAllNotifications();
    }

    /**
     * Gets all of the current user's _unread_ notifications.
     */
    public getUnreadNotifications(): Observable<NotificationBase[]> {
        return this.networkService.fetchUnreadNotifications();
    }

    /**
     * Marks the given notifications as read.
     * @param toMark A list of notification IDs to mark as read.
     */
    public markAsRead(toMark: MarkReadRequest): Observable<void> {
        return this.networkService.markNotificationsAsRead(toMark);
    }

    /**
     * Gets a list of all the things the current user is subscribed to notifications for.
     */
    public getSubscriptions(): Observable<NotificationSubscription[]> {
        return this.networkService.fetchNotificationSubscriptions();
    }

    /**
     * Subscribe to notifications on the source with the given ID.
     * @param sourceId ID of the thing to subscribe to notifications for.
     */
    public subscribe(sourceId: string): Observable<void> {
        return this.networkService.subscribeToNotifications(sourceId);
    }

    /**
     * Unsubscribe to notifications on the source with the given ID.
     * @param sourceId ID of the thing to unsubscribe from.
     */
    public unsubscribe(sourceId: string): Observable<void> {
        return this.networkService.unsubscribeFromNotifications(sourceId);
    }
}
