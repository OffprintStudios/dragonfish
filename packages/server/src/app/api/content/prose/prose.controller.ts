import { Controller, UseInterceptors, Put, UseGuards, Request, 
    Body, Patch, Query, BadRequestException, UploadedFile, Post, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProse } from '@pulp-fiction/models/content';
import { Roles } from '@pulp-fiction/models/users';
import { ContentService, ProseService } from '../../../db/content';
import { RolesGuard } from '../../../guards';
import { isNullOrUndefined } from '../../../util';
import { ImagesService } from '../../images/images.service';

@Controller('prose')
export class ProseController {
    constructor(private readonly proseService: ProseService, private readonly imagesService: ImagesService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-prose')
    async createProse(@Request() req: any, @Body() proseInfo: CreateProse) {
        return await this.proseService.createProse(req.user, proseInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-prose')
    async editProse(@Request() req: any, @Query('contentId') contentId: string, @Body() proseInfo: CreateProse) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`The content ID is required.`);
        }

        return await this.proseService.editProse(req.user, contentId, proseInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('upload-coverart/:proseId')
    async uploadCoverArt(@UploadedFile() coverArtImage: any, @Request() req: any, @Param('proseId') proseId: string) {
        const coverArtUrl = await this.imagesService.upload(coverArtImage, proseId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(coverArtUrl.lastIndexOf('/') + 1)}`;
        return await this.proseService.updateCoverArt(req.user, proseId, coverArt);
    }
}