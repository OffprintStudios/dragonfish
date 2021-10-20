import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ContentStore } from '@dragonfish/api/database/content/stores';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentCommentPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import { ContentCommentJob } from '@dragonfish/shared/models/accounts/notifications/jobs';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable()
export class NotificationService {
    private logger = new Logger('Notifications');

    constructor(@InjectQueue('notifications') private readonly queue: Queue, private readonly content: ContentStore) {}

    //#region ---EVENT HANDLERS---

    @OnEvent(NotificationKind.ContentComment, { async: true })
    private async handleContentComment(payload: ContentCommentPayload) {
        this.logger.log(`Received payload for type ${NotificationKind.ContentComment}`);

        const content = await this.content.fetchOne(payload.contentId, undefined, true);
        const job: ContentCommentJob = {
            recipientId: (content.author as Pseudonym)._id,
            commentId: payload.commentId,
            poster: payload.poster,
            contentId: content._id,
            contentTitle: content.title,
            contentKind: content.kind,
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(NotificationKind.ContentComment, job);
    }

    //#endregion
}
