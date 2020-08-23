import { Controller, Get, Param } from '@nestjs/common';
import { BrowseService } from './browse.service';

@Controller()
export class BrowseController {
    constructor(private readonly browseService: BrowseService) {}

    @Get('all-pub-works/:pageNum') 
    async getAllPutWorks(@Param('pageNum') pageNum: number) {
        return await this.browseService.getAllNewPublishedWorks(pageNum);
    }
}
