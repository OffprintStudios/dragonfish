import { Controller, UseGuards, Request, Get, Post, Body, Put, Param, Patch, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';

import * as models from '@pulp-fiction/models/works';
import { WorksService } from '../../../db/works/works.service';
import { AuthGuard, OptionalAuthGuard, RolesGuard } from '../../../guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../../../api/images/images.service';
import { Roles } from '@pulp-fiction/models/users';

@Controller('works')
export class WorksController {
    constructor (private readonly worksService: WorksService, private readonly imagesService: ImagesService) {}

    @UseGuards(AuthGuard)
    @Get('fetch-user-works/:pageNum')
    async fetchUserWorks(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.worksService.fetchUserWorks(req.user);
    }
    
    @UseGuards(AuthGuard)
    @Patch('delete-work/:workId')
    async deleteWork(@Request() req: any, @Param('workId') workId: string) {
        return await this.worksService.deleteWork(req.user, workId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-like')
    async setLike(@Request() req: any, @Body() setRating: models.SetApprovalRating) {
        return await this.worksService.setLike(req.user.sub, setRating.workId, setRating.oldApprovalRating);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-dislike')
    async setDislike(@Request() req: any, @Body() setRating: models.SetApprovalRating) {
        return await this.worksService.setDislike(req.user.sub, setRating.workId, setRating.oldApprovalRating);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-no-vote')
    async setNoVote(@Request() req: any, @Body() setRating: models.SetApprovalRating) {
        return await this.worksService.setNoVote(req.user.sub, setRating.workId, setRating.oldApprovalRating);
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
            if (work.genres.length < 1 || work.genres.length > models.MAX_GENRES_PER_FICTION) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_GENRES_PER_FICTION} genres.`);
            }
        }
        if (work.category === models.Categories.OriginalFiction) {
            if (work.genres.length < 1 || work.genres.length > models.MAX_GENRES_PER_FICTION) {
                throw new BadRequestException(`You must select between 1 and ${models.MAX_GENRES_PER_FICTION} genres.`);
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
