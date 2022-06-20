import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageForm } from '$shared/models/messages';
import { MessagesService } from '$modules/messages/services';
import { Logger, UseGuards } from '@nestjs/common';
import { Identity } from '$shared/auth';
import { Roles } from '$shared/models/accounts';
import { corsConfig } from '$shared/util';
import { SocketGuard } from '$shared/guards';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from '$shared/models/notifications';

@WebSocketGateway({
    cors: corsConfig,
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger('MessagesGateway');

    @WebSocketServer()
    private server: Server;

    constructor(private readonly messages: MessagesService) {}

    async handleConnection(client: Socket): Promise<any> {
        this.logger.log(`Client ${client.id} has connected to the messages service!`);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client ${client.id} has disconnected from the messages service!`);
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('messages:get-feed')
    async getFeed(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { pseudId: string },
    ) {
        client.join(`messages:feed:${data.pseudId}`);
        const threads = await this.messages.fetchThreads(data.pseudId);
        this.server.in(`messages:feed:${data.pseudId}`).emit('messages:feed', threads);
    }

    @OnEvent('messages:update-feed')
    async updateFeed(notification: Notification) {
        this.logger.log(`Sending updated threads for user ${notification.recipientId}...`);
        const updatedThreads = await this.messages.fetchThreads(notification.recipientId);
        this.server
            .in(`messages:feed:${notification.recipientId}`)
            .emit('messages:update-feed', { threads: updatedThreads, activity: notification });
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('messages:join-thread')
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { threadId: string; pseudId: string },
    ) {
        const messages = await this.messages.fetchMessages(data.threadId, data.pseudId);
        if (messages) {
            this.logger.log(
                `Client ${client.id} has connected to Room messages:thread:${data.threadId}.`,
            );
            client.join(`messages:thread:${data.threadId}`);
            this.server.in(`messages:thread:${data.threadId}`).emit('thread', messages);
        } else {
            this.logger.warn(
                `Client ${client.id} tried to join a room it had no permission to join!`,
            );
        }
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('messages:leave-thread')
    async leaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { threadId: string },
    ) {
        client.leave(`messages:thread:${data.threadId}`);
        this.logger.log(`Client ${client.id} has left Room messages:thread:${data.threadId}.`);
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('messages:send-message')
    async sendMessage(@MessageBody('data') newMessage: SendMessageForm): Promise<void> {
        const savedMessage = await this.messages.sendMessage(newMessage);
        this.server.in(`messages:thread:${newMessage.threadId}`).emit('message', savedMessage);
    }
}
