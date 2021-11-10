import { Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Identity } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/accounts';
import { FollowersService } from '../services';

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
    @Get('check-if-following')
    async checkIfFollowing(@Query('pseudId') pseudId: string, @Query('isFollowing') isFollowing: string) {
        return await this.followers.checkIfFollowing(pseudId, isFollowing);
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
