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
import { OptionalAuthGuard } from '../../guards';
import {
    ContentFilter,
    ContentKind,
    CreateProse,
    FormType,
    NewsChange,
    PubChange,
    PubContent,
} from '@dragonfish/shared/models/content';
import { Roles } from '@dragonfish/shared/models/users';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { Identity, Optional, User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IImages } from '../../shared/images';
import { MAX_FANDOM_TAGS } from '@dragonfish/shared/constants/content-constants';
import { ContentService } from '../../services/content/content.service';
import { RatingsService } from '../../services/content/ratings.service';
import { BlogsStore } from '@dragonfish/api/database/content/stores';
import { ContentLibraryStore } from '@dragonfish/api/database/content-library/stores';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';

@Controller('content')
export class ContentController {
    constructor(
        private readonly content: ContentService,
        @Inject('IImages') private readonly images: IImages,
        private readonly ratings: RatingsService,
        private readonly library: ContentLibraryStore,
        private readonly blogs: BlogsStore,
    ) {}

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Optional(true)
    @Get('fetch-one')
    async fetchOne(
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @User() account?: JwtPayload,
    ): Promise<PubContent> {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        if (account) {
            return {
                content: await this.content.fetchOne(contentId),
                ratings: await this.ratings.fetchRatingsDoc(account.sub, contentId),
                libraryDoc: await this.library.fetchOne(pseudId, contentId),
            };
        } else {
            const content = await this.content.fetchOne(contentId);
            return {
                content: content,
                ratings: null,
                libraryDoc: null,
            };
        }
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one-published')
    async fetchOnePublished(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
    ): Promise<PubContent> {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        const [content, ratings] = await this.content.fetchOnePublished(contentId, kind, user);
        return {
            content: content,
            ratings: ratings,
            libraryDoc: null,
        };
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload, @Query('pseudId') pseudId: string) {
        return await this.content.fetchAll(pseudId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-all-by-kind')
    async fetchAllByKind(@Query('pseudId') pseudId: string, @Query('kinds') kinds: ContentKind[]) {
        return await this.content.fetchAllByKind(pseudId, kinds);
    }

    @ApiTags(DragonfishTags.Content)
    @Get('fetch-all-published')
    async fetchAllPublished(
        @Query('filter') filter: ContentFilter,
        @Query('pageNum') pageNum: number,
        @Query('userId') userId: string,
        @Query('kind') kind: ContentKind[],
    ) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the page number and content kind in your request.`);
        }

        return await this.content.fetchAllPublished(pageNum, kind, filter, userId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Put('create-one')
    async createOne(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: FormType,
    ) {
        if (isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include the content kind with this request.`);
        }
        if ((formInfo as CreateProse)?.tags?.length > MAX_FANDOM_TAGS) {
            throw new BadRequestException(
                `You included too many fandom tags with this request. The max is ${MAX_FANDOM_TAGS}`,
            );
        }

        return await this.content.createOne(pseudId, kind, formInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('save-changes')
    async saveChanges(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
        @Body() formInfo: FormType,
    ) {
        if (isNullOrUndefined(contentId) || isNullOrUndefined(kind)) {
            throw new BadRequestException(`You must include both the content ID and content kind with this request.`);
        }
        if ((formInfo as CreateProse)?.tags?.length > MAX_FANDOM_TAGS) {
            throw new BadRequestException(
                `You included too many fandom tags with this request. The max is ${MAX_FANDOM_TAGS}`,
            );
        }

        return await this.content.saveOne(pseudId, contentId, formInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('delete-one')
    async deleteOne(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.deleteOne(pseudId, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('publish-one')
    async publishOne(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Body() pubChange?: PubChange,
    ) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID.`);
        }

        return await this.content.publishOne(pseudId, contentId, pubChange);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('prose/upload-coverart/:proseId')
    async uploadProseCoverArt(
        @UploadedFile() coverArtImage,
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Param('proseId') proseId: string,
    ) {
        const coverArtUrl = await this.images.upload(coverArtImage, proseId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(
            coverArtUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.content.updateCoverArt(pseudId, proseId, ContentKind.ProseContent, coverArt);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('poetry/upload-coverart/:poetryId')
    async uploadPoetryCoverArt(
        @UploadedFile() coverArtImage,
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Param('poetryId') poetryId: string,
    ) {
        const coverArtUrl = await this.images.upload(coverArtImage, poetryId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(
            coverArtUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.content.updateCoverArt(pseudId, poetryId, ContentKind.PoetryContent, coverArt);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard)
    @Identity(Roles.Admin, Roles.Moderator, Roles.Contributor)
    @Patch('toggle-news-post')
    async toggleNewsPost(@Query('pseudId') pseudId: string, @Body() newsChange: NewsChange) {
        return await this.blogs.toggleNewsPost(pseudId, newsChange);
    }
}
