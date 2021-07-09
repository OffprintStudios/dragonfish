import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationBase, MarkReadRequest, NotificationSubscription } from '@dragonfish/shared/models/notifications';
import { DragonfishNetworkService } from '@dragonfish/client/services';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    constructor(private networkService: DragonfishNetworkService) {}

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
