import { Controller, Inject, Get, Put, Patch, UseGuards, Query, BadRequestException, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ISections } from '../../shared/content';
import { RolesGuard } from '@dragonfish/api/utilities/guards';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { User } from '@dragonfish/api/utilities/decorators';
import { Roles } from '@dragonfish/shared/models/users';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { SectionForm, PublishSection } from '@dragonfish/shared/models/sections';

@Controller('sections')
export class SectionsController {
    constructor(@Inject('ISections') private readonly sections: ISections) {}

    @ApiTags(DragonfishTags.Content)
    @Get('fetch-one-by-id')
    async fetchOneById(@Query('sectionId') sectionId: string, @Query('published') published: boolean) {
        return await this.sections.fetchOneById(sectionId, published);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-user-content-sections')
    async fetchUserContentSections(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }

        return await this.sections.fetchUserContentSections(user, contentId);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-section')
    async createSection(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Body() sectionInfo: SectionForm,
    ) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`You need to include the content ID for this request.`);
        }

        return await this.sections.create(user, contentId, sectionInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-section')
    async editSection(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
        @Body() sectionInfo: SectionForm,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.save(user, contentId, sectionId, sectionInfo);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('publish-section')
    async publishSection(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
        @Body() pubStatus: PublishSection,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.publish(user, contentId, sectionId, pubStatus);
    }

    @ApiTags(DragonfishTags.Content)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-section')
    async deleteSection(
        @User() user: JwtPayload,
        @Query('contentId') contentId: string,
        @Query('sectionId') sectionId: string,
    ) {
        if (isNullOrUndefined(contentId) && isNullOrUndefined(sectionId)) {
            throw new BadRequestException(`You need to provide the section ID for this request.`);
        }

        return await this.sections.delete(user, contentId, sectionId);
    }
}
