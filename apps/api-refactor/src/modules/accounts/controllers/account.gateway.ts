import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CORS_OPTIONS } from '$shared/util';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PseudonymsStore } from '$modules/accounts/db/stores';
import { PseudonymForm } from '$shared/models/accounts';

@WebSocketGateway({
  cors: CORS_OPTIONS,
})
export class AccountGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(AccountGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(private readonly pseudonyms: PseudonymsStore) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} has connected to the Offprint service!`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} has disconnected from the Offprint service!`);
  }

  @SubscribeMessage('account:get-updates')
  async getUpdates(@ConnectedSocket() client: Socket, @MessageBody('data') data: { accountId: string }) {
    client.join(`account:room-${data.accountId}`);
    this.logger.log(`Client ${client.id} joined room-${data.accountId} and subscribed to updates!`);
  }

  @SubscribeMessage('account:create-pseud')
  async createPseud(
    @ConnectedSocket() client: Socket,
    @MessageBody('data') data: { accountId: string; info: PseudonymForm },
  ) {
    const newPseud = await this.pseudonyms.createPseud(data.accountId, data.info);
    this.server.in(`account:room-${data.accountId}`).emit(`account:new-pseud`, newPseud);
  }

  @SubscribeMessage('account:update-pseud')
  async updatePseud(
    @ConnectedSocket() client: Socket,
    @MessageBody('data') data: { pseudId: string; info: PseudonymForm },
  ) {
    const updatedPseud = await this.pseudonyms.updatePseud(data.pseudId, data.info);
    this.server.in(`account:room-${updatedPseud.accountId}`).emit('account:updated-pseud', updatedPseud);
  }
}
