import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionDocument } from '../schemas';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Injectable()
export class SubscriptionsStore {
    constructor(@InjectModel('Subscription') private readonly subscription: Model<SubscriptionDocument>) {}

    //#region ---CRUD OPERATIONS---

    public async create(payload: SubscriptionPayload): Promise<SubscriptionDocument> {
        const newSub = new this.subscription({
            itemId: payload.itemId,
            subscriberId: payload.subscriberId,
            kind: payload.kind,
        });

        return await newSub.save();
    }

    //#endregion
}
