import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { BlogsService } from 'src/db/blogs/blogs.service';
import { WorksService } from 'src/db/works/works.service';

import { FrontendUser } from 'src/db/users/models';
import { Blog } from 'src/db/blogs/models';
import { UsersService } from 'src/db/users/users.service';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly usersService: UsersService, private readonly blogsService: BlogsService, private readonly worksService: WorksService) {}

    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.usersService.getOneUser(userId);
    }

    @Get('get-blogs-list/:userId')
    async getBlogsList(@Param('userId') userId: string) {
        return await this.blogsService.getPubBlogList(userId);
    }

    @Get('get-blog/:blogId')
    async getBlog(@Param('blogId') blogId: string) {
        return await this.blogsService.getOneBlog(blogId);
    }
}
