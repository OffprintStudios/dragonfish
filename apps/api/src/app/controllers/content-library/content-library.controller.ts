import { Controller, UseGuards, Get, Put, Query, Delete } from '@nestjs/common';
import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { ContentLibraryStore } from '@dragonfish/api/database/content-library/stores';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@UseGuards(RolesGuard([Roles.User]))
@Controller('content-library')
export class ContentLibraryController {
    constructor(private readonly libraryStore: ContentLibraryStore) {}

    @Get('fetch')
    public async fetchLibrary(@User() user: JwtPayload) {
        return await this.libraryStore.fetchLibrary(user);
    }

    @Put('add-to')
    public async addToLibrary(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return await this.libraryStore.addToLibrary(user, contentId);
    }

    @Delete('remove')
    public async removeFromLibrary(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return await this.libraryStore.removeFromLibrary(user, contentId);
    }
}
