import {
    Controller,
    UseGuards,
    Query,
    Get,
    BadRequestException,
    Patch,
    Body,
    Put,
    Post,
    Param,
    UseInterceptors,
    UploadedFile,
    Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalAuthGuard, RolesGuard } from '../../guards';
import { ContentFilter, ContentKind, FormType, PubChange } from '@dragonfish/shared/models/content';
import { Roles } from '@dragonfish/shared/models/users';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IContent } from '../../shared/content';
import { IImages } from '../../shared/images';

@Controller('content')
export class ContentController {
    constructor(
        @Inject('IContent') private readonly content: IContent,
        @Inject('IImages') private readonly images: IImages
    ) {}

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one')
    async fetchOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Query('kind') kind: ContentKind) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.content.fetchOne(contentId, kind, user);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one-published')
    async fetchOnePublished(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        return await this.content.fetchOnePublished(contentId, kind, user);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload) {
        return await this.content.fetchAll(user);
    }

    @ApiTags(DragonfishTags.Content)
    @Get('fetch-all-published')
    async fetchAllPublished(
        @Query('filter') filter: ContentFilter,
        @Query('pageNum') pageNum: number,
        @Query('userId') userId: string,
        @Query('kind') kind: ContentKind[]
    ) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the page number and content kind in your request.`);
        }

        return await this.content.fetchAllPublished(pageNum, kind, filter, userId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-one')
    async createOne(@User() user: JwtPayload, @Query('kind') kind: ContentKind, @Body() formInfo: FormType) {
        if (isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content kind with this request.`);
        }

        return await this.content.createOne(user, kind, formInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('save-changes')
    async saveChanges(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: FormType
    ) {
        if (isNullOrUndefined(contentId) || isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the content ID and content kind with this request.`);
        }

        return await this.content.saveOne(user, contentId, formInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-one')
    async deleteOne(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.deleteOne(user, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-one')
    async publishOne(@User() user: JwtPayload, @Query('contentId') contentId: string, @Body() pubChange?: PubChange) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.publishOne(user, contentId, pubChange);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('prose/upload-coverart/:proseId')
    async uploadProseCoverArt(
        @UploadedFile() coverArtImage: any,
        @User() user: JwtPayload,
        @Param('proseId') proseId: string
    ) {
        const coverArtUrl = await this.images.upload(coverArtImage, proseId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(
            coverArtUrl.lastIndexOf('/') + 1
        )}`;
        return await this.content.updateCoverArt(user, proseId, ContentKind.ProseContent, coverArt);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('poetry/upload-coverart/:poetryId')
    async uploadPoetryCoverArt(
        @UploadedFile() coverArtImage: any,
        @User() user: JwtPayload,
        @Param('poetryId') poetryId: string
    ) {
        const coverArtUrl = await this.images.upload(coverArtImage, poetryId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(
            coverArtUrl.lastIndexOf('/') + 1
        )}`;
        return await this.content.updateCoverArt(user, poetryId, ContentKind.PoetryContent, coverArt);
    }
}
