import { Controller } from '@nestjs/common';
import { BlogsService } from 'src/db/blogs/blogs.service';
import { WorksService } from 'src/db/works/works.service';

import { FrontendUser } from 'src/db/users/models';
import { Blog } from 'src/db/blogs/models';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly blogsService: BlogsService, private readonly worksService: WorksService) {}
}
