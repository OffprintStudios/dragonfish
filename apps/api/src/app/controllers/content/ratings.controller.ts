import { Controller, Query, Get, Patch, UseGuards } from '@nestjs/common';
import { RatingsStore } from '../../db/ratings';
import { ApiTags } from '@nestjs/swagger';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratings: RatingsStore) {}

    @ApiTags(DragonfishTags.Content)
    @Get('fetch-ratings')
    async fetchRatings(@Query('contentId') contentId: string) {
        return this.ratings.fetchRatingsDoc(contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('add-like')
    async addLike(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.addLike(user, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('add-dislike')
    async addDislike(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.addDislike(user, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('remove-vote')
    async removeVote(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.removeVote(user, contentId);
    }
}
