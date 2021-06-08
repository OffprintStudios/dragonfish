import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(80, { namespace: 'notifications' })
export class NotificationsGateway {}
