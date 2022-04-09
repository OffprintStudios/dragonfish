import {
    Controller,
    Get,
    Put,
    Patch,
    UseGuards,
    Query,
    BadRequestException,
    Body,
} from '@nestjs/common';
import { IdentityGuard } from '$shared/guards';
import { isNullOrUndefined } from '$shared/util';
import { User, JwtPayload, Identity, Optional } from '$shared/auth';
import { Roles } from '$shared/models/accounts';
import { SectionForm, PublishSection } from '$shared/models/sections';
import { SectionsService } from '../services';

@Controller('sections')
export class SectionsController {
    constructor(private readonly sections: SectionsService) {}

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Optional(true)
    @Get('fetch-sections')
    async fetchSections(@Query('contentId') contentId: string, @Query('pseudId') pseudId: string) {
        return await this.sections.fetchSections(contentId, !pseudId, pseudId);
    }

    @Get('fetch-one-by-id')
    async fetchOneById(
        @Query('sectionId') sectionId: string,
        @Query('published') published = false,
    ) {
        return await this.sections.fetchOneById(sectionId, published);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
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

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
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

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
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

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
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
