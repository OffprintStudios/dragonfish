export interface NotificationSubscription {

    /**
     * The ID of the thing that triggered the notification.
     */
    notificationSourceId: string;

    /**
     * The ID of the user subscribed to the notification source.
     */
    userId: string,    
}