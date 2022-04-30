import { Controller, Get, Post, Patch, Query, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import { Identity } from '$shared/auth';
import { TagKind, TagsForm, TagsModel, TagsTree } from '$shared/models/content/tags';
import { TagsService } from '../services';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get('fetch-tags-trees')
    async fetchTagsTrees(@Query('kind') kind: TagKind): Promise<TagsTree[]> {
        return await this.tagsService.fetchTagsTrees(kind);
    }

    @Get('fetch-descendants')
    async fetchDescendants(@Query('id') id: string): Promise<TagsTree> {
        return await this.tagsService.fetchDescendants(id);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.Admin, Roles.Moderator)
    @Post('create-tag')
    async createTag(@Query('kind') kind: TagKind, @Body() form: TagsForm): Promise<TagsModel> {
        return await this.tagsService.createTag(kind, form);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.Admin, Roles.Moderator)
    @Patch('update-tag')
    async updateTag(@Query('id') id: string, @Body() form: TagsForm): Promise<void> {
        return await this.tagsService.updateTag(id, form);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.Admin, Roles.Moderator)
    @Patch('delete-tag')
    async deleteTag(@Query('id') id: string): Promise<void> {
        return await this.tagsService.deleteTag(id);
    }
}
