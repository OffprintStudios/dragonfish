import { Controller, Get } from '@nestjs/common';
import { BrowseService } from './browse.service';

@Controller()
export class BrowseController {
    constructor(private readonly browseService: BrowseService) {}

    @Get('all-pub-works') 
    async getAllPutWorks() {
        return await this.browseService.getAllNewPublishedWorks();
    }
}
