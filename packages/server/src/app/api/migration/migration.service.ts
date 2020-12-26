import { Injectable } from '@nestjs/common';

import { OldBlogsService } from '../../db/blogs/blogs.service';
import { ContentService } from '../../db/content';
import { WorksService } from '../../db/works/works.service';

@Injectable()
export class MigrationService {
    constructor (private readonly contentService: ContentService, 
        private readonly worksService: WorksService, 
        private readonly blogsService: OldBlogsService) {}
}