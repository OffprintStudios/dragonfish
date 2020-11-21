import { Controller, UseInterceptors, Put, UseGuards, Request, 
    Body, Patch, Query, BadRequestException, UploadedFile, Post, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreatePoetry } from '@pulp-fiction/models/content';
import { Roles } from '@pulp-fiction/models/users';
import { ContentService, PoetryService } from '../../../db/content';
import { RolesGuard } from '../../../guards';
import { isNullOrUndefined } from '../../../util';
import { ImagesService } from '../../images/images.service';

@Controller('poetry')
export class PoetryController {
    constructor(private readonly poetryService: PoetryService, private readonly imagesService: ImagesService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-poetry')
    async createProse(@Request() req: any, @Body() poetryInfo: CreatePoetry) {
        return await this.poetryService.createPoetry(req.user, poetryInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-poetry')
    async editProse(@Request() req: any, @Query('contentId') contentId: string, @Body() poetryInfo: CreatePoetry) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`The content ID is required.`);
        }

        return await this.poetryService.editPoetry(req.user, contentId, poetryInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('upload-coverart/:poetryId')
    async uploadCoverArt(@UploadedFile() coverArtImage: any, @Request() req: any, @Param('poetryId') poetryId: string) {
        const coverArtUrl = await this.imagesService.upload(coverArtImage, poetryId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(coverArtUrl.lastIndexOf('/') + 1)}`;
        return await this.poetryService.updateCoverArt(req.user, poetryId, coverArt);
    }
}