import {
    Controller,
    UseGuards,
    Request,
    Body,
    Get,
    Put,
    Patch,
    Query,
    BadRequestException,
    Inject,
} from '@nestjs/common';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/models/users';
import { CollectionForm } from '@dragonfish/models/collections';
import { isNullOrUndefined } from '../../util';
import { ICollections } from '../../shared/content';

@Controller('collections')
export class CollectionsController {
    constructor(@Inject('ICollections') private readonly collections: ICollections) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections')
    async getAllCollections(@Request() req: any, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collections.getAllCollections(req.user, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-one-collection')
    async getOneCollection(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(
                `This request requires the collection ID and whether or not to grab a private collection.`,
            );
        }
        return await this.collections.getCollection(req.user, collId);
    }

    @Get('get-one-public-collection')
    async getOnePublicCollection(@Query('userId') userId: string, @Query('collId') collId: string) {
        if (isNullOrUndefined(userId) || isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the user ID and collectionId`);
        }

        return await this.collections.getPublicCollection(userId, collId);
    }

    @Get('get-public-collections')
    async getPublicCollections(@Query('userId') userId: string, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collections.getAllPublicCollections(userId, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections-no-paginate')
    async fetchUserCollectionsNoPaginate(@Request() req: any) {
        return await this.collections.getUserCollectionsNoPaginate(req.user);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-collection')
    async createCollection(@Request() req: any, @Body() collInfo: CollectionForm) {
        return await this.collections.create(req.user, collInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-collection')
    async editCollection(@Request() req: any, @Query('collId') collId: string, @Body() collInfo: CollectionForm) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.edit(req.user, collId, collInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-collection')
    async deleteCollection(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.delete(req.user, collId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('add-content')
    async addContent(@Request() req: any, @Query('collId') collId: string, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(`This request requires the collection ID and the content ID.`);
        }
        return await this.collections.addTo(req.user, collId, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('remove-content')
    async removeContent(@Request() req: any, @Query('collId') collId: string, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(
                `This request requires the collection ID, the collection item ID, and the content ID.`,
            );
        }
        return await this.collections.removeFrom(req.user, collId, contentId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-public')
    async setPublic(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.setPublic(req.user, collId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-private')
    async setPrivate(@Request() req: any, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.setPrivate(req.user, collId);
    }
}
