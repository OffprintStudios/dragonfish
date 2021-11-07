import { Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionEvent, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { SubscriptionsService } from '../services';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Identity } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/accounts';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Controller('followers')
export class FollowersController {
    constructor(private readonly subscriptionsService: SubscriptionsService, private readonly events: EventEmitter2) {}

    @Get('fetch-followers')
    async fetchFollowers(@Query('pseudId') pseudId: string) {
        return await this.subscriptionsService.fetchSubscribers(pseudId, SubscriptionKind.FollowingUser);
    }

    @Get('fetch-following')
    async fetchFollowing(@Query('pseudId') pseudId: string) {
        return await this.subscriptionsService.fetchSubscriptions(pseudId, SubscriptionKind.FollowingUser);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Post('follow-user')
    async followUser(@Query('pseudId') pseudId: string, @Query('toFollow') toFollow: string) {
        const payload: SubscriptionPayload = {
            subscriberId: pseudId,
            itemId: toFollow,
            kind: SubscriptionKind.FollowingUser,
        };

        this.events.emit(SubscriptionEvent.FollowingUser, payload);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Delete('unfollow-user')
    async unfollowUser(@Query('pseudId') pseudId: string, @Query('toUnfollow') toUnfollow: string) {
        this.events.emit(SubscriptionEvent.Delete, { userId: pseudId, itemId: toUnfollow });
    }
}
