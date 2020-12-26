import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { ContentKind } from '@pulp-fiction/models/content';
import { MigrationForm } from '@pulp-fiction/models/migration';

import { OldBlogsService } from '../../db/blogs/blogs.service';
import { ContentService } from '../../db/content';
import { WorksService } from '../../db/works/works.service';

@Injectable()
export class MigrationService {
    constructor (private readonly contentService: ContentService, 
        private readonly worksService: WorksService, 
        private readonly blogsService: OldBlogsService) {}

    async fetchWorks(user: JwtPayload, pageNum: number) {
        return await this.worksService.fetchUserWorks(user, pageNum);
    }

    async fetchBlogs(user: JwtPayload, pageNum: number) {
        return await this.blogsService.fetchUserBlogs(user, pageNum);
    }

    async fetchOneBlog(user: JwtPayload, blogId: string) {
        return await this.blogsService.findOneById(user, blogId);
    }

    async fetchOneWork(user: JwtPayload, workId: string) {
        return await this.worksService.findOneById(user, workId);
    }

    async saveMigration(user: JwtPayload, formData: MigrationForm) {
        switch (formData.kind) {
            case ContentKind.BlogContent:
                return;
            case ContentKind.ProseContent:
                return;
            default:
                throw new BadRequestException(`Migration can only apply to prose and blogs.`);
        }
    }
}