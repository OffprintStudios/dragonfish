import { Controller, UseGuards, Request, Param, Body, Get, Put, Patch, Query, BadRequestException } from '@nestjs/common';

import { RolesGuard } from '../../../guards';
import { Roles } from '@pulp-fiction/models/users';
import { CollectionForm } from '@pulp-fiction/models/collections';
import { CollectionsService } from '../../../db/collections/collections.service';
import { isNullOrUndefined } from '../../../util';

@Controller('collections')
export class CollectionsController {
    constructor(private readonly collsService: CollectionsService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections')
    async getAllCollections(@Request() req: any, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collsService.getAllCollections(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-one-collection')
    async getOneCollection(@Request() req: any, @Query('collId') collId: string, @Query('getPublic') getPublic: boolean) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collsService.getOneCollection(req.user, collId, getPublic);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-public-collections')
    async getPublicCollections(@Request() req: any, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collsService.getPublicCollections(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections-no-paginate')
    async fetchUserCollectionsNoPaginate(@Request() req: any) {
        return await this.collsService.getUserCollectionsNoPaginate(req.user);
    }
    
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-collection')
    async createCollection(@Request() req: any, @Body() collInfo: CollectionForm) {
        return await this.collsService.createCollection(req.user.sub, collInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-collection')
    async editCollection(@Request() req: any, @Query('collId') collId: string, @Body() collInfo: CollectionForm) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collsService.editCollection(req.user, collId, collInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-collection')
    async deleteCollection(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collsService.deleteCollection(req.user, collId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('add-content')
    async addContent(@Request() req: any, @Query('collId') collId: string, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(`This request requires the collection ID and the content ID.`);
        }
        return await this.collsService.addToCollection(req.user, collId, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('remove-content')
    async removeContent(@Request() req: any, @Query('collId') collId: string, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(`This request requires the collection ID, the collection item ID, and the content ID.`);
        }
        return await this.collsService.removeFromCollection(req.user, collId, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-public')
    async setPublic(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collsService.setPublic(req.user, collId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-private')
    async setPrivate(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collsService.setPrivate(req.user, collId);
    }
}
