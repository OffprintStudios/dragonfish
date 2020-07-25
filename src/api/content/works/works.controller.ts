import { Controller, UseGuards, Request, Get, Post, Body, Put } from '@nestjs/common';

import * as models from 'src/db/works/models';
import { WorksService } from 'src/db/works/works.service';
import { AuthGuard } from 'src/guards';

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
}
