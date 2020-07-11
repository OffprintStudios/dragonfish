import { Controller, UseGuards, Request, Get, Put, Body } from '@nestjs/common';

import * as models from 'src/db/blogs/models';
import { BlogsService } from 'src/db/blogs/blogs.service';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    // @UseGuards(AuthGuard('jwt'))
    @Get('fetch-user-blogs')
    async fetchUserBlogs(@Request() req: any) {
        return await this.blogsService.fetchUserBlogs(req.user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Put('create-blog')
    async createBlog(@Request() req: any, @Body() newBlog: models.CreateBlog) {
        return await this.blogsService.createNewBlog(req.user, newBlog);
    }
}