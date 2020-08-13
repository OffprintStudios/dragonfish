import { Injectable } from '@nestjs/common';

import { Work } from 'shared/models/works';
import { WorksService } from 'src/db/works/works.service';

@Injectable()
export class BrowseService {
    constructor(private readonly worksService: WorksService) {}

    /**
     * Gets all new published works in descending order.
     */
    async getAllNewPublishedWorks(): Promise<Work[]> {
        return await this.worksService.fetchNewPublishedWorks();
    }
}
