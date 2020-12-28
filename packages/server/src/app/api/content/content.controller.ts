import { Controller, UseGuards, Request, Query, Get, BadRequestException, Patch, Body } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { OptionalAuthGuard, RolesGuard } from '../../guards';
import { ContentService } from '../../db/content';
import { ContentFilter, ContentKind, SetRating } from '@pulp-fiction/models/content';
import { Roles } from '@pulp-fiction/models/users';
import { isNullOrUndefined } from '../../util';

@Controller()
export class ContentController {
    constructor (private readonly contentService: ContentService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one')
    async fetchOne(@Request() req: any, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOne(contentId, kind, req.user);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one-published')
    async fetchOnePublished(@Request() req: any, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOnePublished(contentId, kind, req.user);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@Request() req: any) {
        return await this.contentService.fetchAll(req.user);
    }

    @Get('fetch-all-published')
    async fetchAllPublished(@Request() req: any, @Cookies('contentFilter') filter: ContentFilter, @Query('pageNum') pageNum: number, @Query('userId') userId: string, @Query('kind') kind: ContentKind[]) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the page number and content kind in your request.`);
        }

        return await this.contentService.fetchAllPublished(pageNum, kind, filter, userId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-one')
    async deleteOne(@Request() req: any, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.deleteOne(req.user, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-one')
    async publishOne(@Request() req: any, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.submitForApproval(req.user, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-like')
    async setLike(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setLike(req.user.sub, setRating.workId, setRating.oldApprovalRating);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-dislike')
    async setDislike(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setDislike(req.user.sub, setRating.workId, setRating.oldApprovalRating);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-no-vote')
    async setNoVote(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setNoVote(req.user.sub, setRating.workId, setRating.oldApprovalRating);
    }
}
