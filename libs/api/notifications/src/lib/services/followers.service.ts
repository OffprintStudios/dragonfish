import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionsStore } from '../db/stores';
import { Subscription, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FollowersService {
    private logger = new Logger(`Followers`);

    constructor(private readonly subscriptions: SubscriptionsStore, private readonly events: EventEmitter2) {}

    public async checkIfFollowing(pseudId: string, isFollowing: string) {
        return await this.subscriptions.fetchOne(pseudId, isFollowing);
    }

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

        const countFollowersPayload = {
            pseudId: toFollow,
            numFollowers: await this.subscriptions.countSubscribers(toFollow, SubscriptionKind.FollowingUser),
        };

        const countFollowingPayload = {
            pseudId: pseudId,
            numFollowing: await this.subscriptions.countSubscriptions(pseudId, SubscriptionKind.FollowingUser),
        };

        this.events.emit('pseudonyms.update-follower-count', countFollowersPayload);
        this.events.emit('pseudonyms.update-following-count', countFollowingPayload);
        return await this.subscriptions.create(payload);
    }

    public async unfollowUser(pseudId: string, toUnfollow: string): Promise<void> {
        return await this.subscriptions.delete(pseudId, toUnfollow);
    }
}
