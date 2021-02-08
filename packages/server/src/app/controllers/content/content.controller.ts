import { Controller, UseGuards, Request, Query, Get, BadRequestException, Patch, Body, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';

import { OptionalAuthGuard, RolesGuard } from '../../guards';
import { ContentStore } from '../../db/content';
import { ContentFilter, ContentKind, FormType, PubChange, SetRating } from '@dragonfish/models/content';
import { Roles } from '@dragonfish/models/users';
import { isNullOrUndefined } from '../../util';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentStore) {}

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one')
    async fetchOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOne(contentId, kind, user);
    }

    @ApiTags('content')
    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one-published')
    async fetchOnePublished(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOnePublished(contentId, kind, user);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload) {
        return await this.contentService.fetchAll(user);
    }

    @ApiTags('content')
    @Get('fetch-all-published')
    async fetchAllPublished(
        @Cookies('contentFilter') filter: ContentFilter,
        @Query('pageNum') pageNum: number,
        @Query('userId') userId: string,
        @Query('kind') kind: ContentKind[],
    ) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the page number and content kind in your request.`);
        }

        return await this.contentService.fetchAllPublished(pageNum, kind, filter, userId);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-one')
    async createOne(@User() user: JwtPayload, @Query('kind') kind: ContentKind, @Body() formInfo: FormType) {
        if (isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content kind with this request.`);
        }

        return await this.contentService.createOne(user, kind, formInfo);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('save-changes')
    async saveChanges(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: FormType,
    ) {
        if (isNullOrUndefined(contentId) || isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the content ID and content kind with this request.`);
        }

        return await this.contentService.saveChanges(user, contentId, formInfo);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-one')
    async deleteOne(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.deleteOne(user, contentId);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-one')
    async publishOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Body() pubChange?: PubChange) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.publishOne(user, contentId, pubChange);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-like')
    async setLike(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.contentService.setLike(user, setRating.workId, setRating.oldApprovalRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-dislike')
    async setDislike(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.contentService.setDislike(user, setRating.workId, setRating.oldApprovalRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-no-vote')
    async setNoVote(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.contentService.setNoVote(user, setRating.workId, setRating.oldApprovalRating);
    }
}
