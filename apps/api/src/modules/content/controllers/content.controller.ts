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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ContentFilter,
    ContentKind,
    CreateProse,
    FormType,
    NewsChange,
    PubChange,
} from '$shared/models/content';
import { Roles } from '$shared/models/accounts';
import { isNullOrUndefined } from '$shared/util';
import { Identity, User, JwtPayload } from '$shared/auth';
import { ContentService, RatingsService } from '../services';
import { IdentityGuard, RolesGuard } from '$shared/guards';
import { ContentLibraryService } from '../services';
import { ImagesService } from '$modules/utilities';

@Controller('content')
export class ContentController {
    constructor(
        private readonly content: ContentService,
        private readonly ratings: RatingsService,
        private readonly library: ContentLibraryService,
        private readonly images: ImagesService,
    ) {}

    @Get('fetch-one')
    async fetchOne(@Query('contentId') contentId: string) {
        return await this.content.fetchOne(contentId);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Get('fetch-ratings')
    async fetchRatings(@User() account: JwtPayload, @Query('contentId') contentId: string) {
        return await this.ratings.fetchRatingsDoc(account.sub, contentId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-library-doc')
    async fetchLibraryDoc(
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.library.fetchOne(pseudId, contentId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-all')
    async fetchAll(@User() user: JwtPayload, @Query('pseudId') pseudId: string) {
        return await this.content.fetchAll(pseudId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-all-by-kind')
    async fetchAllByKind(@Query('pseudId') pseudId: string, @Query('kind') kinds: ContentKind[]) {
        return await this.content.fetchAllByKind(pseudId, kinds);
    }

    @Get('fetch-all-published')
    async fetchAllPublished(
        @Query('filter') filter: ContentFilter,
        @Query('pageNum') pageNum: number,
        @Query('userId') userId: string,
        @Query('kind') kind: ContentKind[],
    ) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(
                `You must include both the page number and content kind in your request.`,
            );
        }

        return await this.content.fetchAllPublished(pageNum, kind, filter, userId);
    }

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
        if ((formInfo as CreateProse)?.tags?.length > 5) {
            throw new BadRequestException(
                `You included too many fandom tags with this request. The max is ${5}`,
            );
        }

        return await this.content.createOne(pseudId, kind, formInfo);
    }

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
            throw new BadRequestException(
                `You must include both the content ID and content kind with this request.`,
            );
        }
        if ((formInfo as CreateProse)?.tags?.length > 5) {
            throw new BadRequestException(
                `You included too many fandom tags with this request. The max is ${5}`,
            );
        }

        return await this.content.saveOne(pseudId, contentId, formInfo);
    }

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
        return await this.content.updateCoverArt(
            pseudId,
            proseId,
            ContentKind.ProseContent,
            coverArt,
        );
    }

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
        return await this.content.updateCoverArt(
            pseudId,
            poetryId,
            ContentKind.PoetryContent,
            coverArt,
        );
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.Admin, Roles.Moderator, Roles.Contributor)
    @Patch('toggle-news-post')
    async toggleNewsPost(@Query('pseudId') pseudId: string, @Body() newsChange: NewsChange) {
        return await this.content.toggleNewsPost(pseudId, newsChange);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.Admin, Roles.Moderator, Roles.Contributor)
    @Patch('toggle-featured')
    async toggleFeatured(@Query('pseudId') pseudId: string, @Body() featuredChange: NewsChange) {
        return await this.content.toggleFeatured(pseudId, featuredChange);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @UseInterceptors(FileInterceptor('banner'))
    @Post('change-banner')
    async changeBanner(
        @UploadedFile() bannerImage,
        @Query('pseudId') pseudId: string,
        @Query('blogId') blogId: string,
    ) {
        const bannerArtUrl = await this.images.upload(bannerImage, blogId, 'blog-banners');
        const bannerArt = `${process.env.IMAGES_HOSTNAME}/blog-banners/${bannerArtUrl.substr(
            bannerArtUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.content.changeBanner(pseudId, blogId, bannerArt);
    }
}
