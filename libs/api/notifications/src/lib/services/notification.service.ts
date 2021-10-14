import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationService {
    private logger = new Logger('Notifications');

    constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

    @OnEvent('notification.content-comment', { async: true })
    async handleContentComment(payload) {
        this.logger.log(`Received payload!`);
        this.logger.log(`Payload info: ${payload.thisWorks}`);
    }
}
