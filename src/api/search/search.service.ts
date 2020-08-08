import { Injectable } from '@nestjs/common';

import { User } from '../../db/users/models';
import { Work } from '../../db/works/models';
import { Blog } from '../../db/blogs/models';
import { UsersService } from '../../db/users/users.service';
import { WorksService } from '../../db/works/works.service';
import { BlogsService } from '../../db/blogs/blogs.service';

@Injectable()
export class SearchService {
    constructor(private readonly worksService: WorksService, private readonly blogsService: BlogsService,
        private readonly usersService: UsersService) { }

        
}
