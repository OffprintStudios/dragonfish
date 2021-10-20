import { Injectable } from '@angular/core';
import { Logger } from '@nestjs/common';
import { SubscriptionsStore } from '../db/stores';
import { OnEvent } from '@nestjs/event-emitter';
import { SubscriptionEvent } from '@dragonfish/shared/models/accounts/notifications';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Injectable()
export class SubscriptionsService {
    private logger = new Logger(`Subscriptions`);

    constructor(private readonly subscriptions: SubscriptionsStore) {}

    //#region ---EVENT HANDLERS---

    @OnEvent(SubscriptionEvent.ContentLibrary, { async: true })
    private async handleContentSubscription(payload: SubscriptionPayload) {
        this.logger.log(
            `Creating subscription for ${payload.subscriberId} on item ${payload.itemId} of type '${payload.kind}'...`,
        );
        await this.subscriptions.create(payload).then(() => {
            this.logger.log(`Subscription created!`);
        });
    }

    @OnEvent(SubscriptionEvent.Delete, { async: true })
    private async handleDeleteSub(payload: { userId: string; itemId: string }) {
        this.logger.log(`Deleting subscription for item ${payload.itemId}...`);
        await this.subscriptions.delete(payload.userId, payload.itemId);
    }

    //#endregion
}
