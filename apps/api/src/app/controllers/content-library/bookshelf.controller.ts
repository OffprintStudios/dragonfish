import { Body, Controller, Get, Patch, Post, Delete, Query, UseGuards, UploadedFile, Inject } from '@nestjs/common';
import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { BookshelfStore } from '@dragonfish/api/database/content-library/stores';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { User } from '@dragonfish/api/utilities/decorators';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';
import { IImages } from '../../shared/images';

@Controller('bookshelves')
export class BookshelfController {
    constructor(private readonly bookshelfStore: BookshelfStore, @Inject('IImages') private readonly images: IImages) {}

    //#region ---BOOKSHELF ROUTES---

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-bookshelves')
    public async fetchBookshelves(@User() user: JwtPayload) {
        return await this.bookshelfStore.fetchShelves(user);
    }

    @Get('fetch-public-bookshelves')
    public async fetchPublicBookshelves(@Query('userId') userId: string) {
        return await this.bookshelfStore.fetchPublicShelves(userId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-bookshelf')
    public async fetchOneBookshelf(@User() user: JwtPayload, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.fetchOneShelf(user, shelfId);
    }

    @Get('fetch-one-public-bookshelf')
    public async fetchOnePublicBookshelf(@Query('userId') userId: string, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.fetchOnePublicShelf(userId, shelfId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Post('create-bookshelf')
    public async createBookshelf(@User() user: JwtPayload, @Body() formData: BookshelfForm) {
        return await this.bookshelfStore.createBookshelf(user, formData);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-bookshelf')
    public async editBookshelf(
        @User() user: JwtPayload,
        @Query('shelfId') shelfId: string,
        @Body() formData: BookshelfForm,
    ) {
        return await this.bookshelfStore.editBookshelf(user, shelfId, formData);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('toggle-visibility')
    public async toggleVisibility(@User() user: JwtPayload, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.toggleVisibility(user, shelfId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Delete('delete-bookshelf')
    public async deleteBookshelf(@User() user: JwtPayload, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.deleteShelf(user, shelfId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('update-cover-pic')
    public async updateCoverPic(
        @User() user: JwtPayload,
        @Query('shelfId') shelfId: string,
        @UploadedFile() coverPic: any,
    ) {
        const coverUrl = await this.images.upload(coverPic, user.sub, 'cover-pics');
        const cover = `${process.env.IMAGES_HOSTNAME}/bookshelf-covers/${coverUrl.substr(
            coverUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.bookshelfStore.changeCoverPic(user, shelfId, cover);
    }

    //#endregion

    //#region ---SHELF ITEM ROUTES---

    @Get('fetch-public-items')
    public async fetchPublicItems(@Query('userId') userId: string, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.fetchItems(userId, shelfId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-items')
    public async fetchItems(@User() user: JwtPayload, @Query('shelfId') shelfId: string) {
        return await this.bookshelfStore.fetchItems(user.sub, shelfId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-item')
    public async addItem(
        @User() user: JwtPayload,
        @Query('shelfId') shelfId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.bookshelfStore.addItem(user, shelfId, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Delete('remove-item')
    public async removeItem(
        @User() user: JwtPayload,
        @Query('shelfId') shelfId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.bookshelfStore.removeItem(user, shelfId, contentId);
    }

    //#endregion
}
