import { Controller, UseGuards, Request, Get, Post, Body, Put, Param, Patch } from '@nestjs/common';

import * as models from 'src/db/works/models';
import { WorksService } from 'src/db/works/works.service';
import { AuthGuard, OptionalAuthGuard } from 'src/guards';

@Controller('works')
export class WorksController {
    constructor (private readonly worksService: WorksService) {}

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

}
