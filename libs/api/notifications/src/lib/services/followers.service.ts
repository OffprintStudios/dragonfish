import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionsStore } from '../db/stores';
import { Subscription, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Injectable()
export class FollowersService {
    private logger = new Logger(`Followers`);

    constructor(private readonly subscriptions: SubscriptionsStore) {}

    public async fetchFollowers(pseudId: string): Promise<Subscription[]> {
        return await this.subscriptions.fetchSubscribers(pseudId, SubscriptionKind.FollowingUser, true);
    }

    public async fetchFollowing(pseudId: string): Promise<Subscription[]> {
        return await this.subscriptions.fetchSubscriptions(pseudId, SubscriptionKind.FollowingUser, true);
    }

    public async followUser(pseudId: string, toFollow: string): Promise<Subscription> {
        const payload: SubscriptionPayload = {
            subscriberId: pseudId,
            itemId: toFollow,
            kind: SubscriptionKind.FollowingUser,
        };

        return await this.subscriptions.create(payload);
    }

    public async unfollowUser(pseudId: string, toUnfollow: string): Promise<void> {
        return await this.subscriptions.delete(pseudId, toUnfollow);
    }
}
