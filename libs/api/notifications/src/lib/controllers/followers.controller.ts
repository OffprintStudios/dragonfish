import { Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionEvent, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Identity } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/accounts';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import { FollowersService } from '../services/followers.service';

@Controller('followers')
export class FollowersController {
    constructor(private readonly followers: FollowersService) {}

    @Get('fetch-followers')
    async fetchFollowers(@Query('pseudId') pseudId: string) {
        return await this.followers.fetchFollowers(pseudId);
    }

    @Get('fetch-following')
    async fetchFollowing(@Query('pseudId') pseudId: string) {
        return await this.followers.fetchFollowing(pseudId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Post('follow-user')
    async followUser(@Query('pseudId') pseudId: string, @Query('toFollow') toFollow: string) {
        return await this.followers.followUser(pseudId, toFollow);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Delete('unfollow-user')
    async unfollowUser(@Query('pseudId') pseudId: string, @Query('toUnfollow') toUnfollow: string) {
        return await this.followers.unfollowUser(pseudId, toUnfollow);
    }
}
