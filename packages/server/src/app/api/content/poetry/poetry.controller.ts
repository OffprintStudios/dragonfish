import { Controller, Put, UseGuards, Request, Body, Patch, Query, BadRequestException } from '@nestjs/common';

import { CreatePoetry } from '@pulp-fiction/models/content';
import { Roles } from '@pulp-fiction/models/users';
import { ContentService, PoetryService } from '../../../db/content';
import { RolesGuard } from '../../../guards';
import { isNullOrUndefined } from '../../../util';

@Controller('poetry')
export class PoetryController {
    constructor(private readonly contentService: ContentService, private readonly poetryService: PoetryService) {}

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
}