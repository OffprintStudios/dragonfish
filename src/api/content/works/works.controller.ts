import { Controller, UseGuards, Request, Get, Post, Body, Put, Param, Patch, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';

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
        this.validateWork(newWork);       
        return await this.worksService.createNewWork(req.user, newWork);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('get-work/:workId')
    async getWork(@Request() req: any, @Param('workId') workId: string) {
        return await this.worksService.findOneWorkById(workId, req.user);
    }

    @UseGuards(AuthGuard)
    @Patch('edit-work')
    async editWork(@Request() req: any, @Body() workInfo: models.EditWork) {
        this.validateWork(workInfo);
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
        this.validateSection(newSection);
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
        this.validateSection(someEdits);
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
        const coverArtUrl = await this.imagesService.upload(coverArtImage, workId, 'coverart');
        const coverArt = `${process.env.IMAGES_HOSTNAME}/coverart/${coverArtUrl.substr(coverArtUrl.lastIndexOf('/') + 1)}`;
        return await this.worksService.updateCoverArt(req.user, coverArt, workId);
    }

    /**
     * Validates the given work for errors. Throws a BadRequestException if any are found.
     * Does nothing if the work is valid.
     */
    private validateWork(work: models.CreateWork | models.EditWork): void {
        if (work.title.length < 3 || work.title.length > 100) {
            throw new BadRequestException("Titles must be between 3 and 100 characters.");
        }
        if (work.shortDesc.length < 3 || work.shortDesc.length > 250) {
            throw new BadRequestException("Short descriptions must be between 3 and 250 characters.");
        }
        if (work.longDesc.length < 5) {
            throw new BadRequestException("Long descriptions must be at least 5 characters long.")
        }
        if (!work.category) {
            throw new BadRequestException("You must select a category.");
        }
        if (!work.rating) {
            throw new BadRequestException("You must select a content rating.");
        }
        if (!work.status) {
            throw new BadRequestException("You must select a status.");
        }

        // Category-specific validation
        if (work.category === models.Categories.Fanfiction) {
            if (work.fandoms.length < 1 || work.fandoms.length > models.MAX_FANDOMS_PER_STORY) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_FANDOMS_PER_STORY} fandoms.`);
            }
            if (work.genres.length < 1 || work.genres.length > models.MAX_GENRES_PER_FANFIC) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_GENRES_PER_FANFIC} genres.`);
            }
        }
        if (work.category === models.Categories.OriginalFiction) {
            if (work.genres.length < 1 || work.genres.length > models.MAX_GENRES_PER_ORIGINAL) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_GENRES_PER_ORIGINAL} genres.`);
            }
        }
        if (work.category === models.Categories.Poetry) {
            if (work.genres.length < 1 || work.genres.length > models.MAX_GENRES_PER_POEM) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_GENRES_PER_POEM} genres.`);
            }
        }         
    }

    /**
     * Validates the given section for errors. Throws a BadRequestException if any are found.
     * Does nothing if the section is valid.     
     */
    private validateSection(section: models.CreateSection | models.EditSection): void {
        if (section.title.length < 3 || section.title.length > 100) {
            throw new BadRequestException("Section titles must be between 3 and 100 characters.");
        }
        if (section.body.length < 5) {
            throw new BadRequestException("Section bodies must be at least 5 characters long.");
        }
        if (section.authorsNote && section.authorsNote.length < 3) {
            throw new BadRequestException("Author's notes must be at least 3 characters long.")
        }
    }
}
