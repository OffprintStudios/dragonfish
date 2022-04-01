import { Controller, Query, Patch, UseGuards } from '@nestjs/common';
import { RatingsStore } from '../db/stores';
import { RolesGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import { User, Identity, JwtPayload } from '$shared/auth';
import type { RatingOption } from '$shared/models/ratings';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratings: RatingsStore) {}

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('change-vote')
    async changeVote(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('rating') rating: RatingOption,
    ) {
        return this.ratings.changeVote(user, contentId, rating);
    }
}
