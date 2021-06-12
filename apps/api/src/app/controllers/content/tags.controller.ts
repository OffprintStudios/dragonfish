import { Controller, Get, Post, Patch, Query, Body, UseGuards, Inject } from '@nestjs/common';
import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { TagKind, TagsForm, TagsModel } from '@dragonfish/shared/models/content';
import { TagsTree } from '@dragonfish/shared/models/content/tags.model';
import { ITagsService } from '../../shared/content';

@Controller('tags')
export class TagsController {
    constructor(@Inject('ITagsService') private readonly tagsService: ITagsService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-tags')
    async fetchTags(@Query('kind') kind: TagKind): Promise<TagsModel[]> {
        return await this.tagsService.fetchTags(kind);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('fetch-descendants')
    async fetchChildren(@Query('id') id: string): Promise<TagsTree> {
        return await this.tagsService.fetchDescendants(id);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Post('create-tag')
    async createTag(@Query('kind') kind: TagKind, @Body() form: TagsForm): Promise<TagsModel> {
        return await this.tagsService.createTag(kind, form);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('update-tag')
    async updateTag(@Query('id') id: string, @Body() form: TagsForm): Promise<TagsModel> {
        return await this.tagsService.updateTag(id, form);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('delete-tag')
    async deleteTag(@Query('id') id: string): Promise<void> {
        return await this.tagsService.deleteTag(id);
    }
}
