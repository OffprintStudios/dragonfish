import { Controller, UseGuards, Get, Put, Query, Delete } from '@nestjs/common';
import { Roles } from '$shared/models/accounts';
import { Identity } from '$shared/auth';
import { IdentityGuard } from '$shared/guards';
import { ContentLibraryService } from '../services';

@UseGuards(IdentityGuard)
@Controller('content-library')
export class ContentLibraryController {
    constructor(private readonly library: ContentLibraryService) {}

    @Identity(Roles.User)
    @Get('fetch')
    public async fetchLibrary(@Query('pseudId') pseudId: string) {
        return await this.library.fetchLibrary(pseudId);
    }

    @Identity(Roles.User)
    @Put('add-to')
    public async addToLibrary(
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.library.addToLibrary(pseudId, contentId);
    }

    @Identity(Roles.User)
    @Delete('remove')
    public async removeFromLibrary(
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        return await this.library.removeFromLibrary(pseudId, contentId);
    }
}
