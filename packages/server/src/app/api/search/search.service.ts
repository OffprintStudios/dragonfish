import { Injectable } from '@nestjs/common';

import { UsersService } from '../../db/users/users.service';
import { WorksService } from '../../db/works/works.service';
import { BlogsService } from '../../db/blogs/blogs.service';
import { ContentFilter } from '@pulp-fiction/models/works';

@Injectable()
export class SearchService {
    constructor(private readonly worksService: WorksService, private readonly blogsService: BlogsService,
        private readonly usersService: UsersService) { }

    async fetchInitialResults(query: string, contentFilter: ContentFilter) {
        const initialUsers = await this.usersService.findInitialRelatedUsers(query);
        const initialBlogs = await this.blogsService.findInitialRelatedBlogs(query);
        const initialWorks = await this.worksService.findInitialRelatedWorks(query, contentFilter);

        return {users: initialUsers, blogs: initialBlogs, works: initialWorks};
    }
    
    async searchUsers(query: string, pageNum: number) {
        return await this.usersService.findRelatedUsers(query, pageNum);
    }

    async searchBlogs(query: string, pageNum: number) {
        return await this.blogsService.findRelatedBlogs(query, pageNum);
    }

    async searchWorks(query: string, pageNum: number, contentFilter: ContentFilter) {
        return await this.worksService.findRelatedWorks(query, pageNum, contentFilter);
    }
}
