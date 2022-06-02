import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { corsConfig } from '$shared/util';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketGuard } from '$shared/guards';
import { Identity } from '$shared/auth';
import { Roles } from '$shared/models/accounts';
import { NotificationStore } from '$modules/notifications/db/stores';
import { Notification } from '$shared/models/notifications';

@WebSocketGateway({
    cors: corsConfig,
    namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger('NotificationsGateway');

    @WebSocketServer()
    private server: Server;

    constructor(private readonly notifications: NotificationStore) {}

    async handleConnection(client: Socket) {
        this.logger.log(`Client ${client.id} has connected to the activity service!`);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client ${client.id} has disconnected from the activity service!`);
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('activity:subscribe')
    async subscribeToActivity(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { pseudId: string },
    ) {
        const activity = await this.notifications.fetchAllUnread(data.pseudId);
        const newRoom = `activity:${data.pseudId}`;
        client.join(newRoom);
        this.logger.log(`Client ${client.id} has connected to Activity Feed for ${data.pseudId}.`);
        this.server.in(newRoom).emit('activity:feed', activity);
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('activity:unsubscribe')
    async unsubscribeFromActivity(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { pseudId: string },
    ) {
        const currRoom = `activity:${data.pseudId}`;
        this.logger.log(
            `Client ${client.id} has disconnected from Activity Feed for ${data.pseudId}`,
        );
        client.leave(currRoom);
    }

    @OnEvent('activity:push-notification')
    async handlePushNotification(notification: Notification) {
        const currRoom = `activity:${notification.recipientId}`;
        this.server.in(currRoom).emit('notification', notification);
    }
}
