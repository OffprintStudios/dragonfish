import { Controller, UseGuards, Body, Param, Request, Get, Put, Patch } from '@nestjs/common';

import * as models from 'shared/models/docs';
import { Roles } from 'shared/models/users';
import { RolesGuard } from 'src/guards';
import { DocsService } from 'src/db/docs/docs.service';

@Controller('docs')
export class DocsController {
    constructor(private readonly docsService: DocsService) {}

    @UseGuards(RolesGuard([Roles.Admin]))
    @Put('create-doc')
    async createDoc(@Request() req: any, @Body() docInfo: models.CreateDoc) {
        return this.docsService.createDoc(req.user, docInfo);
    }

    @UseGuards(RolesGuard([Roles.Contributor, Roles.Moderator, Roles.Admin]))
    @Get('fetch-for-dashboard')
    async fetchForDashboard() {
        return await this.docsService.fetchAllDocsForDashboard();
    }

    @UseGuards(RolesGuard([Roles.Contributor, Roles.Moderator, Roles.Admin]))
    @Get('fetch-one-for-edits/:docId')
    async fetchOneForEdits(@Request() req: any, @Param('docId') docId: string) {
        return await this.docsService.fetchDocForEdit(req.user, docId);
    }

    @Get('fetch-one/:docId')
    async fetchOne(@Param('docId') docId: string) {
        return await this.docsService.fetchDoc(docId);
    }

    @UseGuards(RolesGuard([Roles.Contributor, Roles.Moderator, Roles.Admin]))
    @Patch('edit-doc')
    async editDoc(@Request() req: any, @Body() docInfo: models.EditDoc) {
        return await this.docsService.editDoc(req.user, docInfo);
    }

    @UseGuards(RolesGuard([Roles.Admin]))
    @Patch('delete-doc/:docId')
    async deleteDoc(@Request() req: any, @Param('docId') docId: string) {
        return await this.docsService.deleteDoc(req.user, docId);
    }
}
