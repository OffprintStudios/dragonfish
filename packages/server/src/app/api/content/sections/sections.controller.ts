import { BadRequestException, Body, Controller, Get, Patch, Put, Query, Request, UseGuards } from '@nestjs/common';

import { SectionForm, PublishSection } from '@pulp-fiction/models/sections';
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

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-section')
    async editSection(@Request() req: any, @Query('contentId') contentId: string, @Query('sectionId') sectionId: string, @Body() sectionInfo: SectionForm) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.contentService.editSection(req.user, contentId, sectionId, sectionInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-section')
    async publishSection(@Request() req: any, @Query('contentId') contentId: string, @Query('sectionId') sectionId: string, @Body() pubStatus: PublishSection) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.contentService.publishSection(req.user, contentId, sectionId, pubStatus);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-section')
    async deleteSection(@Request() req: any, @Query('contentId') contentId: string, @Query('sectionId') sectionId: string) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.contentService.deleteSection(req.user, contentId, sectionId);
    }
}