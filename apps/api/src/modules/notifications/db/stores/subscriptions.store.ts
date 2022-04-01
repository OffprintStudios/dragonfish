import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowersDocument, SubscriptionDocument } from '../schemas';
import { SubscriptionPayload } from '$shared/models/notifications/payloads';
import { SubscriptionKind } from '$shared/models/notifications';

@Injectable()
export class SubscriptionsStore {
    constructor(
        @InjectModel('Subscription') private readonly subscription: Model<SubscriptionDocument>,
        @InjectModel(SubscriptionKind.FollowingUser)
        private readonly followingUser: Model<FollowersDocument>,
    ) {}

    //#region ---FETCHING---

    public async fetchAllForUser(pseudId: string) {
        return this.subscription.find({ subscriberId: pseudId });
    }

    public async fetchOne(subscriberId: string, itemId: string) {
        return this.subscription.findOne({ subscriberId, itemId });
    }

    public async fetchSubscribers(itemId: string, subKind: SubscriptionKind, populate?: boolean) {
        if (populate) {
            return this.subscription.find({ itemId, kind: subKind }).populate('itemId');
        } else {
            return this.subscription.find({ itemId, kind: subKind });
        }
    }

    public async fetchSubscriptions(
        subscriberId: string,
        subKind: SubscriptionKind,
        populate?: boolean,
    ) {
        if (populate) {
            return this.subscription.find({ subscriberId, kind: subKind }).populate('subscriberId');
        } else {
            return this.subscription.find({ subscriberId, kind: subKind });
        }
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
            throw new ConflictException(
                `This user already has an active subscription to this item!`,
            );
        }
    }

    public async delete(pseudId: string, itemId: string): Promise<void> {
        await this.subscription.deleteOne({ itemId: itemId, subscriberId: pseudId });
    }

    //#endregion

    //#region ---COUNTS---

    public async countSubscribers(itemId: string, kind: SubscriptionKind) {
        return this.subscription.countDocuments({ itemId, kind });
    }

    public async countSubscriptions(pseudId: string, kind: SubscriptionKind) {
        return this.subscription.countDocuments({ subscriberId: pseudId, kind });
    }

    //#endregion
}
