import { Controller, Get, Put, Patch, UseGuards, Query, BadRequestException, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdentityGuard } from '../../guards';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { User } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/users';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { SectionForm, PublishSection } from '@dragonfish/shared/models/sections';
import { SectionsService } from '../../services/content/sections.service';

@Controller('sections')
export class SectionsController {
    constructor(private readonly sections: SectionsService) {}

    @ApiTags(DragonfishTags.Content)
    @Get('fetch-one-by-id')
    async fetchOneById(@Query('sectionId') sectionId: string, @Query('published') published: boolean) {
        return await this.sections.fetchOneById(sectionId, published);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Get('fetch-user-content-sections')
    async fetchUserContentSections(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
    ) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }

        return await this.sections.fetchUserContentSections(pseudId, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Put('create-section')
    async createSection(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Body() sectionInfo: SectionForm,
    ) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }

        return await this.sections.create(pseudId, contentId, sectionInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('edit-section')
    async editSection(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
        @Body() sectionInfo: SectionForm,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.save(pseudId, contentId, sectionId, sectionInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('publish-section')
    async publishSection(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
        @Body() pubStatus: PublishSection,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.publish(pseudId, contentId, sectionId, pubStatus);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('delete-section')
    async deleteSection(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.delete(pseudId, contentId, sectionId);
    }
}
