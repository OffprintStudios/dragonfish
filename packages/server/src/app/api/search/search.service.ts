import { Injectable } from '@nestjs/common';

import { sanitizeHtml } from '@pulp-fiction/html_sanitizer'
import { UsersService } from '../../db/users/users.service';
import { WorksService } from '../../db/works/works.service';
import { BlogsService } from '../../db/blogs/blogs.service';
import { ContentFilter } from '@pulp-fiction/models/works';

@Injectable()
export class SearchService {
    constructor(private readonly worksService: WorksService, private readonly blogsService: BlogsService,
        private readonly usersService: UsersService) { }

    async fetchInitialResults(query: string, contentFilter: ContentFilter) {
        const parsedQuery = "\"" + await sanitizeHtml(query) + "\"";

        const initialUsers = await this.usersService.findInitialRelatedUsers(parsedQuery);
        const initialBlogs = await this.blogsService.findInitialRelatedBlogs(parsedQuery);
        const initialWorks = await this.worksService.findInitialRelatedWorks(parsedQuery, contentFilter);

        return {users: initialUsers, blogs: initialBlogs, works: initialWorks};
    }
    
    async searchUsers(query: string, pageNum: number) {
        const parsedQuery = "\"" + await sanitizeHtml(query) + "\"";
        return await this.usersService.findRelatedUsers(parsedQuery, pageNum);
    }

    async searchBlogs(query: string, pageNum: number) {
        const parsedQuery = "\"" + await sanitizeHtml(query) + "\""
        return await this.blogsService.findRelatedBlogs(parsedQuery, pageNum);
    }

    async searchWorks(query: string, pageNum: number, contentFilter: ContentFilter) {
        const parsedQuery = "\"" + await sanitizeHtml(query) + "\""
        return await this.worksService.findRelatedWorks(parsedQuery, pageNum, contentFilter);
    }
}
