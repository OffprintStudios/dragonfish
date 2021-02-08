import { Controller, UseGuards, Request, Query, Get, BadRequestException, Patch, Body, Put, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';

import { OptionalAuthGuard, RolesGuard } from '../../guards';
import { ContentFilter, ContentKind, FormType, PubChange, SetRating } from '@dragonfish/models/content';
import { Roles } from '@dragonfish/models/users';
import { isNullOrUndefined } from '../../util';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';
import { IContent } from '../../shared/content/content.interface';

@Controller('content')
export class ContentController {
    constructor(@Inject('IContent') private readonly content: IContent) {}

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one')
    async fetchOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.content.fetchOne(contentId, kind, user);
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

        return await this.content.fetchOnePublished(contentId, kind, user);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload) {
        return await this.content.fetchAll(user);
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

        return await this.content.fetchAllPublished(pageNum, kind, filter, userId);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-one')
    async createOne(@User() user: JwtPayload, @Query('kind') kind: ContentKind, @Body() formInfo: FormType) {
        if (isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content kind with this request.`);
        }

        return await this.content.createOne(user, kind, formInfo);
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

        return await this.content.saveOne(user, contentId, formInfo);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-one')
    async deleteOne(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.deleteOne(user, contentId);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-one')
    async publishOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Body() pubChange?: PubChange) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.publishOne(user, contentId, pubChange);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-like')
    async setLike(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.content.setLike(user, setRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-dislike')
    async setDislike(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.content.setDislike(user, setRating);
    }

    @ApiTags('content')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-no-vote')
    async setNoVote(@User() user: JwtPayload, @Body() setRating: SetRating) {
        return await this.content.setNoVote(user, setRating);
    }
}
