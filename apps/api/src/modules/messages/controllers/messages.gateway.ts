import {
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
import { MessagesSocketGuard } from '$modules/messages/services/messages-socket.guard';
import { Identity } from '$shared/auth';
import { Roles } from '$shared/models/accounts';

@WebSocketGateway({
    cors: {
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://offprint.net',
            /\.offprint\.net$/,
        ],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    },
    namespace: '/messages',
    transports: ['websocket'],
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger('MessagesGateway');

    @WebSocketServer()
    private server: Server;

    constructor(private readonly messages: MessagesService) {}

    async handleConnection(client: Socket): Promise<any> {
        this.logger.log(`Client ${client.id} is attempting to connect to the messages service...`);
        client.on('join-room', async (data) => {
            const messages = await this.messages.fetchMessages(data.threadId, data.pseudId);
            if (messages) {
                this.logger.log(`Client ${client.id} has connected to Room ${data.threadId}!`);
                client.join(data.threadId);
                this.server.in(data.threadId).emit('thread', messages);
            } else {
                this.logger.warn(
                    `Client ${client.id} tried to join a room it had no permission to join!`,
                );
            }
        });
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client ${client.id} has disconnected from the messages service!`);
    }

    @UseGuards(MessagesSocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('send-message')
    async messagesConnect(@MessageBody('data') newMessage: SendMessageForm): Promise<void> {
        const savedMessage = await this.messages.sendMessage(newMessage);
        this.server.in(newMessage.threadId).emit('message', savedMessage);
    }
}
