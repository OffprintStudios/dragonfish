import { Controller, Get, Query } from '@nestjs/common';
import { SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { SubscriptionsService } from '../services';

@Controller('followers')
export class FollowersController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get('fetch-followers')
    async fetchFollowers(@Query('pseudId') pseudId: string) {
        return await this.subscriptionsService.fetchSubscribers(pseudId, SubscriptionKind.FollowingUser);
    }

    @Get('fetch-following')
    async fetchFollowing(@Query('pseudId') pseudId: string) {
        return await this.subscriptionsService.fetchSubscriptions(pseudId, SubscriptionKind.FollowingUser);
    }
}
