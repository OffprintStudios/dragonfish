import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private usersOnline = 0;

    async handleConnection() {
        this.usersOnline++;
        this.server.emit('usersOnline', this.usersOnline);
    }

    async handleDisconnect() {
        this.usersOnline--;
        this.server.emit('usersOnline', this.usersOnline);
    }
}
