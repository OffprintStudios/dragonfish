import { Controller, Get, Put, UseGuards, Request, Query, Body } from '@nestjs/common';
import { RolesGuard } from '../../guards';
import { MigrationService } from './migration.service';
import { Roles } from '@pulp-fiction/models/users';
import { MigrationForm } from '@pulp-fiction/models/migration';

@Controller()
export class MigrationController {
    constructor (private readonly migrationService: MigrationService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-works')
    async fetchWorks(@Request() req: any, @Query('pageNum') pageNum: number) {
        return await this.migrationService.fetchWorks(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-blogs')
    async fetchBlogs(@Request() req: any, @Query('pageNum') pageNum: number) {
        return await this.migrationService.fetchBlogs(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-work')
    async fetchOneWork(@Request() req: any, @Query('workId') workId: string) {
        return await this.migrationService.fetchOneWork(req.user, workId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-one-blog')
    async fetchOneBlog(@Request() req: any, @Query('blogId') blogId: string) {
        return await this.migrationService.fetchOneBlog(req.user, blogId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('save-migration')
    async saveMigration(@Request() req: any, @Body() formData: MigrationForm) {
        return await this.migrationService.saveMigration(req.user, formData);
    }
}