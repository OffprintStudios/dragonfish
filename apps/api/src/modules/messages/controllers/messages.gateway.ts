import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    path: 'messages',
})
export class MessagesGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server;

    handleConnection(client: Socket, data: string) {
        if (!client.rooms.has(`messages-${data}`)) {
            client.rooms.add(`messages-${data}`);
        }
        client.join(`messages-${data}`);
    }

    @SubscribeMessage('connectToThread')
    messagesConnect(@ConnectedSocket() client: Socket, @MessageBody('threadId') threadId: string) {
        client.join(`messages-${threadId}`);
    }
}
