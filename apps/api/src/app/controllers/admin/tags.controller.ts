import { Controller, Post, Patch, Query, Body, UseGuards } from '@nestjs/common';
import { TagsStore } from '@dragonfish/api/database/content/stores';
import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { TagKind, TagsForm } from '@dragonfish/shared/models/content';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsStore: TagsStore) {}

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Post('create-tag')
    async createTag(@Query('kind') kind: TagKind, @Body() form: TagsForm) {
        return await this.tagsStore.createParent(form, kind);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('add-child')
    async addChild(@Query('parent') parent: string, @Body() form: TagsForm) {
        return await this.tagsStore.addChild(parent, form);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('update-tag')
    async updateTag(@Query('id') id: string, @Body() form: TagsForm) {
        return await this.tagsStore.updateParent(id, form);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('update-child')
    async updateChild(@Query('parent') parent: string, @Query('child') child: string, @Body() form: TagsForm) {
        return await this.tagsStore.updateChild(parent, child, form);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('delete-tag')
    async deleteTag(@Query('id') id: string) {
        return await this.tagsStore.deleteParent(id);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Patch('add-child')
    async removeChild(@Query('parent') parent: string, @Query('child') child: string) {
        return await this.tagsStore.removeChild(parent, child);
    }
}
