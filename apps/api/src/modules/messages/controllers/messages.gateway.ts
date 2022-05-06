import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageForm } from '$shared/models/messages';
import { MessagesService } from '$modules/messages/services';
import { UseGuards } from '@nestjs/common';
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
})
export class MessagesGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly messages: MessagesService) {}

    async handleConnection(client: Socket, threadId: string, pseudId: string): Promise<any> {
        const threadData = await this.messages.fetchThread(threadId, pseudId);
        if (threadData) {
            client.on('join-room', () => {
                client.join(threadId);
                this.server.in(threadId).emit('thread', threadData);
            });
        } else {
            throw new WsException(`You aren't allowed to view this thread.`);
        }
    }

    @UseGuards(MessagesSocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('send-message')
    async messagesConnect(@MessageBody('data`') newMessage: SendMessageForm): Promise<void> {
        const savedMessage = await this.messages.sendMessage(newMessage);
        this.server.in(newMessage.threadId).emit('message', savedMessage);
    }
}
