import { Controller, UseGuards, Get, Put, Query, Delete } from '@nestjs/common';
import { Roles } from '@dragonfish/shared/models/accounts';
import { ContentLibraryStore } from '@dragonfish/api/database/content-library/stores';
import { Identity, User } from '@dragonfish/api/utilities/decorators';
import { IdentityGuard } from '@dragonfish/api/utilities/guards';

@UseGuards(IdentityGuard)
@Controller('content-library')
export class ContentLibraryController {
    constructor(private readonly libraryStore: ContentLibraryStore) {}

    @Identity(Roles.User)
    @Get('fetch')
    public async fetchLibrary(@Query('pseudId') pseudId: string) {
        return await this.libraryStore.fetchLibrary(pseudId);
    }

    @Identity(Roles.User)
    @Put('add-to')
    public async addToLibrary(@Query('pseudId') pseudId: string, @Query('contentId') contentId: string) {
        return await this.libraryStore.addToLibrary(pseudId, contentId);
    }

    @Identity(Roles.User)
    @Delete('remove')
    public async removeFromLibrary(@Query('pseudId') pseudId: string, @Query('contentId') contentId: string) {
        return await this.libraryStore.removeFromLibrary(pseudId, contentId);
    }
}
