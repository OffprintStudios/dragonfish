import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { Work, ContentFilter } from '@pulp-fiction/models/works';
import { WorksService } from '../../db/works/works.service';

@Injectable()
export class BrowseService {
    constructor(private readonly worksService: WorksService) {}

    /**
     * Gets all new published works in descending order.
     */
    async getAllNewPublishedWorks(contentFilter: ContentFilter, pageNum: number): Promise<PaginateResult<Work>> {
        return await this.worksService.fetchNewPublishedWorks(contentFilter, pageNum);
    }
}
