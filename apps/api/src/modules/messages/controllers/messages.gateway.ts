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

@WebSocketGateway({
    cors: corsConfig,
    namespace: '/messages',
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
        
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('join-room')
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { threadId: string; pseudId: string },
    ) {
        const messages = await this.messages.fetchMessages(data.threadId, data.pseudId);
        if (messages) {
            this.logger.log(`Client ${client.id} has connected to Room ${data.threadId}.`);
            client.join(data.threadId);
            this.server.in(data.threadId).emit('thread', messages);
        } else {
            this.logger.warn(
                `Client ${client.id} tried to join a room it had no permission to join!`,
            );
        }
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('leave-room')
    async leaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody('data') data: { threadId: string },
    ) {
        client.leave(data.threadId);
        this.logger.log(`Client ${client.id} has left Room ${data.threadId}.`);
    }

    @UseGuards(SocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('send-message')
    async sendMessage(@MessageBody('data') newMessage: SendMessageForm): Promise<void> {
        const savedMessage = await this.messages.sendMessage(newMessage);
        this.server.in(newMessage.threadId).emit('message', savedMessage);
    }
}
