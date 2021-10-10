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
import { OptionalAuthGuard, IdentityGuard } from '../../guards';
import {
    ContentFilter,
    ContentKind,
    CreateProse,
    FormType,
    PubChange,
    PubContent,
} from '@dragonfish/shared/models/content';
import { Roles } from '@dragonfish/shared/models/users';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IImages } from '../../shared/images';
import { MAX_FANDOM_TAGS } from '@dragonfish/shared/constants/content-constants';
import { ContentService } from '../../services/content/content.service';
import { RatingsService } from '../../services/content/ratings.service';

@Controller('content')
export class ContentController {
    constructor(
        private readonly content: ContentService,
        @Inject('IImages') private readonly images: IImages,
        private readonly ratings: RatingsService,
    ) {}

    @ApiTags(DragonfishTags.Content)
    @UseGuards(OptionalAuthGuard)
    @Get('fetch-one')
    async fetchOne(@Query('contentId') contentId: string, @User() account?: JwtPayload): Promise<PubContent> {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You must include the content ID and the content kind in your request.`);
        }

        if (account) {
            const ratings = await this.ratings.fetchRatingsDoc(account.sub, contentId);
            const content = await this.content.fetchOne(contentId);
            return {
                content: content,
                ratings: ratings,
            };
        } else {
            const content = await this.content.fetchOne(contentId);
            return {
                content: content,
                ratings: null,
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
        };
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload, @Query('pseudId') pseudId: string) {
        return await this.content.fetchAll(pseudId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
    @UseGuards(IdentityGuard([Roles.User]))
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
}
