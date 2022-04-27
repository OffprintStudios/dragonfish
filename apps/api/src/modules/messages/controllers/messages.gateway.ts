import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
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
    path: '/messages',
})
export class MessagesGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly messages: MessagesService) {}

    handleConnection(client: Socket, threadId: string): any {
        client.on('join-room', () => {
            client.join(threadId);
        });
    }

    @UseGuards(MessagesSocketGuard)
    @Identity(Roles.User)
    @SubscribeMessage('send-message')
    async messagesConnect(@MessageBody('data`') newMessage: SendMessageForm): Promise<void> {
        const savedMessage = await this.messages.sendMessage(newMessage);
        this.server.in(newMessage.threadId).emit('message', savedMessage);
    }
}
