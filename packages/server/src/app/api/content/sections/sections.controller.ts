import { BadRequestException, Body, Controller, Get, Put, Query, Request, UseGuards } from '@nestjs/common';

import { SectionForm } from '@pulp-fiction/models/sections';
import { Roles } from '@pulp-fiction/models/users';
import { ContentService } from '../../../db/content';
import { SectionsService } from '../../../db/sections/sections.service';
import { RolesGuard } from '../../../guards';
import { isNullOrUndefined } from '../../../util';

@Controller('sections')
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService, private readonly contentService: ContentService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-content-sections')
    async fetchUserContentSections(@Request() req: any, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }

        return await this.contentService.fetchUserContentSections(req.user, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-section')
    async createSection(@Request() req: any, @Query('contentId') contentId: string, @Body() sectionInfo: SectionForm) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }
        
        return await this.contentService.createSection(req.user, contentId, sectionInfo);
    }
}