import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesService]
})
export class MessagesModule {}
