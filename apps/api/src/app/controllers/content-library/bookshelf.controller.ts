import { Body, Controller, Get, Patch, Post, Delete, Query, UseGuards, UploadedFile, Inject } from '@nestjs/common';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';
import { Identity } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/accounts';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';
import { IImages } from '../../shared/images';
import { LibraryService } from '../../services/content/library.service';

@Controller('bookshelves')
export class BookshelfController {
    constructor(@Inject('IImages') private readonly images: IImages, private readonly library: LibraryService) {}

    //#region ---BOOKSHELF ROUTES---

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-bookshelves')
    public async fetchBookshelves(@Query('pseudId') pseudId: string) {
        return await this.library.fetchShelves(pseudId);
    }

    @Get('fetch-public-bookshelves')
    public async fetchPublicBookshelves(@Query('pseudId') pseudId: string) {
        return await this.library.fetchPublicShelves(pseudId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('fetch-one-bookshelf')
    public async fetchOneBookshelf(@Query('pseudId') pseudId: string, @Query('shelfId') shelfId: string) {
        return await this.library.fetchOneShelf(pseudId, shelfId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Post('create-bookshelf')
    public async createBookshelf(@Query('pseudId') pseudId: string, @Body() formData: BookshelfForm) {
        return await this.library.createShelf(pseudId, formData);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('edit-bookshelf')
    public async editBookshelf(
        @Query('pseudId') pseudId: string,
        @Query('shelfId') shelfId: string,
        @Body() formData: BookshelfForm,
    ) {
        return await this.library.editShelf(pseudId, shelfId, formData);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('toggle-visibility')
    public async toggleVisibility(@Query('pseudId') pseudId: string, @Query('shelfId') shelfId: string) {
        return await this.library.toggleVisibility(pseudId, shelfId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Delete('delete-bookshelf')
    public async deleteBookshelf(@Query('pseudId') pseudId: string, @Query('shelfId') shelfId: string) {
        return await this.library.deleteShelf(pseudId, shelfId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('update-cover-pic')
    public async updateCoverPic(
        @Query('pseudId') pseudId: string,
        @Query('shelfId') shelfId: string,
        @UploadedFile() coverPic: any,
    ) {
        const coverUrl = await this.images.upload(coverPic, pseudId, 'cover-pics');
        const cover = `${process.env.IMAGES_HOSTNAME}/bookshelf-covers/${coverUrl.substr(
            coverUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.library.changeCover(pseudId, shelfId, cover);
    }

    //#endregion

    //#region ---SHELF ITEM ROUTES---

    @Get('fetch-items')
    public async fetchItems(@Query('pseudId') pseudId: string, @Query('shelfId') shelfId: string) {
        return await this.library.fetchItems(pseudId, shelfId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Get('check-item')
    public async checkItem(
        @Query('pseudId') pseudId: string,
        @Query('shelfId') shelfId: string,
        @Query('contentId') contentId: string,
    ) {
        return { isPresent: await this.library.checkItem(pseudId, shelfId, contentId) };
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Post('add-item')
    public async addItem(
        @Query('pseudId') pseudId: string,
        @Query('shelfId') shelfId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.library.addItem(pseudId, shelfId, contentId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Delete('remove-item')
    public async removeItem(
        @Query('pseudId') pseudId: string,
        @Query('shelfId') shelfId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.library.removeItem(pseudId, shelfId, contentId);
    }

    //#endregion
}
