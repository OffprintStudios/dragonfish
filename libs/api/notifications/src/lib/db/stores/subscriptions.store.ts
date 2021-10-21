import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionDocument } from '../schemas';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Injectable()
export class SubscriptionsStore {
    constructor(@InjectModel('Subscription') private readonly subscription: Model<SubscriptionDocument>) {}

    //#region ---FETCHING---

    public async fetchAll(pseudId: string) {
        return this.subscription.find({ subscriberId: pseudId });
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public async create(payload: SubscriptionPayload): Promise<SubscriptionDocument> {
        const existingSub = await this.subscription.findOne({
            subscriberId: payload.subscriberId,
            itemId: payload.itemId,
            kind: payload.kind,
        });

        if (existingSub === null || existingSub === undefined) {
            const newSub = new this.subscription({
                itemId: payload.itemId,
                subscriberId: payload.subscriberId,
                kind: payload.kind,
            });

            return await newSub.save();
        } else {
            throw new ConflictException(`This user already has an active subscription to this item!`);
        }
    }

    public async delete(pseudId: string, itemId: string): Promise<void> {
        await this.subscription.deleteOne({ itemId: itemId, subscriberId: pseudId });
    }

    //#endregion
}
