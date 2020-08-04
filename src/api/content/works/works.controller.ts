import { Controller, UseGuards, Request, Get, Post, Body, Put, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';

import * as models from 'src/db/works/models';
import { WorksService } from 'src/db/works/works.service';
import { AuthGuard, OptionalAuthGuard } from 'src/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from 'src/api/images/images.service';

@Controller('works')
export class WorksController {
    constructor (private readonly worksService: WorksService, private readonly imagesService: ImagesService) {}

    @UseGuards(AuthGuard)
    @Get('fetch-user-works')
    async fetchUserWorks(@Request() req: any) {
        return await this.worksService.fetchUserWorks(req.user);
    }

    @UseGuards(AuthGuard)
    @Put('create-work')
    async createWork(@Request() req: any, @Body() newWork: models.CreateWork) {
        return await this.worksService.createNewWork(req.user, newWork);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('get-work/:workId')
    async getWork(@Request() req: any, @Param('workId') workId: string) {
        return await this.worksService.findOneWorkById(workId);
    }

    @UseGuards(AuthGuard)
    @Patch('edit-work')
    async editWork(@Request() req: any, @Body() workInfo: models.EditWork) {
        return await this.worksService.editWork(req.user, workInfo);
    }

    @UseGuards(AuthGuard)
    @Patch('delete-work/:workId')
    async deleteWork(@Request() req: any, @Param('workId') workId: string) {
        return await this.worksService.deleteWork(req.user, workId);
    }

    @UseGuards(AuthGuard)
    @Put('create-section/:workId')
    async createSection(@Request() req: any, @Param('workId') workId: string, @Body() newSection: models.CreateSection) {
        return await this.worksService.createNewSection(req.user, workId, newSection);
    }

    @UseGuards(AuthGuard)
    @Get('get-section-for-user/:workId/:sectionId')
    async getSectionForUser(@Request() req: any, @Param('workId') workId: string, @Param('sectionId') sectionId: string) {
        return await this.worksService.getSectionForUser(req.user, workId, sectionId);
    }

    @UseGuards(AuthGuard)
    @Patch('edit-section/:workId/:sectionId')
    async editSection(@Request() req: any, @Param('workId') workId: string, @Param('sectionId') sectionId: string, @Body() someEdits: models.EditSection) {
        return await this.worksService.editSection(req.user, workId, sectionId, someEdits);
    }

    @UseGuards(AuthGuard)
    @Patch('set-publishing-status/:workId/:sectionId')
    async setPubStatus(@Request() req: any, @Param('workId') workId: string, @Param('sectionId') sectionId: string, @Body() pubStatus: models.PublishSection) {
        return await this.worksService.publishSection(req.user, workId, sectionId, pubStatus);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('fetch-section/:workId/:sectionId')
    async fetchSection(@Request() req: any, @Param('workId') workId: string, @Param('sectionId') sectionId: string) {
        return await this.worksService.findOneSectionById(workId, sectionId);
    }

    @UseGuards(AuthGuard)
    @Patch('delete-section/:workId/:sectionId')
    async deleteSection(@Request() req: any, @Param('workId') workId: string, @Param('sectionId') sectionId: string) {
        return await this.worksService.deleteSection(req.user, workId, sectionId);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('coverart'))
    @Post('upload-coverart/:workId')
    async uploadCoverArt(@UploadedFile() coverArtImage: any, @Request() req: any, @Param('workId') workId: string) {
        const coverArtUrl = await this.imagesService.upload(coverArtImage, req.user.sub, 'coverart');
        const coverArt = `https://images.offprint.net/coverart/${coverArtUrl.substr(coverArtUrl.lastIndexOf('/') + 1)}`;
        return await this.worksService.updateCoverArt(req.user, coverArt, workId);
    }
}
