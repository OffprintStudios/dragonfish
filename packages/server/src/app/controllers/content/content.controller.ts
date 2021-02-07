import { Controller, UseGuards, Request, Query, Get, BadRequestException, Patch, Body, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';

import { OptionalAuthGuard, RolesGuard } from '../../guards';
import { ContentService } from '../../db/content';
import {
    BlogForm,
    ContentFilter,
    ContentKind,
    CreatePoetry,
    CreateProse,
    NewsForm,
    PubChange,
    SetRating,
} from '@dragonfish/models/content';
import { Roles } from '@dragonfish/models/users';
import { isNullOrUndefined } from '../../util';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one')
    async fetchOne(@Request() req: any, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOne(contentId, kind, req.user);
    }

    @ApiTags('content')
    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one-published')
    async fetchOnePublished(
        @Request() req: any,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.contentService.fetchOnePublished(contentId, kind, req.user);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@Request() req: any) {
        return await this.contentService.fetchAll(req.user);
    }

    @ApiTags('content')
    @Get('fetch-all-published')
    async fetchAllPublished(
        @Request() req: any,
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
    async createOne(
        @Request() req: any,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: BlogForm | NewsForm | CreateProse | CreatePoetry,
    ) {
        if (isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content kind with this request.`);
        }

        return await this.contentService.createOne(req.user, kind, formInfo);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('save-changes')
    async saveChanges(
        @Request() req: any,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: BlogForm | NewsForm | CreateProse | CreatePoetry,
    ) {
        if (isNullOrUndefined(contentId) || isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the content ID and content kind with this request.`);
        }

        return await this.contentService.saveChanges(req.user, contentId, formInfo);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-one')
    async deleteOne(@Request() req: any, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.deleteOne(req.user, contentId);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-one')
    async publishOne(@Request() req: any, @Query('contentId') contentId: string, @Body() pubChange?: PubChange) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.contentService.publishOne(req.user, contentId, pubChange);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-like')
    async setLike(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setLike(req.user, setRating.workId, setRating.oldApprovalRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-dislike')
    async setDislike(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setDislike(req.user, setRating.workId, setRating.oldApprovalRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-no-vote')
    async setNoVote(@Request() req: any, @Body() setRating: SetRating) {
        return await this.contentService.setNoVote(req.user, setRating.workId, setRating.oldApprovalRating);
    }
}
