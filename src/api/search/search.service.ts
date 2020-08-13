import { Injectable } from '@nestjs/common';

import { SearchUserDocument } from '../../db/users/models';
import { UsersService } from '../../db/users/users.service';
import { WorksService } from '../../db/works/works.service';
import { BlogsService } from '../../db/blogs/blogs.service';
import { SearchParameters, SearchResults, Pagination } from './models';

@Injectable()
export class SearchService {
    constructor(private readonly worksService: WorksService, private readonly blogsService: BlogsService,
        private readonly usersService: UsersService) { }

    
    async searchUsers(query: string, pageNum: number, pageSize: number): Promise<SearchResults<SearchUserDocument>> {
        const parameters: SearchParameters = {
            text: query,
            pagination: new Pagination({page: `${pageNum}`, pageSize: `${pageSize}`})
        };
        return await this.usersService.findRelatedUsers(parameters);
    }

    async searchBlogs() {

    }

    async searchWorks() {

    }
}
