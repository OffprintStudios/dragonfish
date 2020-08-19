import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BlogsService } from 'src/db/blogs/blogs.service';
import { WorksService } from 'src/db/works/works.service';

import { UsersService } from 'src/db/users/users.service';
import { OptionalAuthGuard } from 'src/guards';
import { CollectionsService } from 'src/db/collections/collections.service';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly usersService: UsersService, 
        private readonly blogsService: BlogsService, 
        private readonly worksService: WorksService,
        private readonly collsService: CollectionsService) {}

    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.usersService.getOneUser(userId);
    }

    @Get('get-blogs-list/:userId/:pageNum')
    async getBlogsList(@Param('userId') userId: string, @Param('pageNum') pageNum: number) {
        return await this.blogsService.getPubBlogList(userId, pageNum);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('get-blog/:blogId')
    async getBlog(@Request() req: any, @Param('blogId') blogId: string) {
        return await this.blogsService.getOneBlog(blogId, req.user);
    }

    @Get('get-works-list/:userId/:pageNum')
    async getWorksList(@Param('userId') userId: string, @Param('pageNum') pageNum: number) {
        return await this.worksService.getWorksList(userId, pageNum);
    }

    @Get('get-port-collections/:userId/:pageNum')
    async getPortCollections(@Param('userId') userId: string) {
        return await this.collsService.getPortfolioCollections(userId);
    }

    @Get('get-one-collection/:userId/:collId')
    async getOneCollection(@Param('userId') userId: string, @Param('collId') collId: string) {
        return await this.collsService.getOnePortCollection(userId, collId);
    }
}
