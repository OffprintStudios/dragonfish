import { Controller, UseGuards, Body, Get, Put, Patch, Query, BadRequestException, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/models/users';
import { CollectionForm } from '@dragonfish/models/collections';
import { isNullOrUndefined } from '../../util';
import { ICollections } from '../../shared/content';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';

@Controller('collections')
export class CollectionsController {
    constructor(@Inject('ICollections') private readonly collections: ICollections) {}

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections')
    async getAllCollections(@User() user: JwtPayload, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collections.getAllCollections(user, pageNum);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-one-collection')
    async getOneCollection(@User() user: JwtPayload, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(
                `This request requires the collection ID and whether or not to grab a private collection.`,
            );
        }
        return await this.collections.getCollection(user, collId);
    }

    @ApiTags('Collections')
    @Get('get-one-public-collection')
    async getOnePublicCollection(@Query('userId') userId: string, @Query('collId') collId: string) {
        if (isNullOrUndefined(userId) || isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the user ID and collectionId`);
        }

        return await this.collections.getPublicCollection(userId, collId);
    }

    @ApiTags('Collections')
    @Get('get-public-collections')
    async getPublicCollections(@Query('userId') userId: string, @Query('pageNum') pageNum: number) {
        if (isNullOrUndefined(pageNum)) {
            throw new BadRequestException(`This request must include the page number.`);
        }
        return await this.collections.getAllPublicCollections(userId, pageNum);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Get('get-all-collections-no-paginate')
    async fetchUserCollectionsNoPaginate(@User() user: JwtPayload) {
        return await this.collections.getUserCollectionsNoPaginate(user);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-collection')
    async createCollection(@User() user: JwtPayload, @Body() collInfo: CollectionForm) {
        return await this.collections.create(user, collInfo);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-collection')
    async editCollection(@User() user: JwtPayload, @Query('collId') collId: string, @Body() collInfo: CollectionForm) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.edit(user, collId, collInfo);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('delete-collection')
    async deleteCollection(@User() user: JwtPayload, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.delete(user, collId);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('add-content')
    async addContent(@User() user: JwtPayload, @Query('collId') collId: string, @Query('contentId') contentId: string) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(`This request requires the collection ID and the content ID.`);
        }
        return await this.collections.addTo(user, collId, contentId);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('remove-content')
    async removeContent(
        @User() user: JwtPayload,
        @Query('collId') collId: string,
        @Query('contentId') contentId: string,
    ) {
        if (isNullOrUndefined(collId) || isNullOrUndefined(contentId)) {
            throw new BadRequestException(
                `This request requires the collection ID, the collection item ID, and the content ID.`,
            );
        }
        return await this.collections.removeFrom(user, collId, contentId);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-public')
    async setPublic(@User() user: JwtPayload, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.setPublic(user, collId);
    }

    @ApiTags('Collections')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('set-private')
    async setPrivate(@User() user: JwtPayload, @Query('collId') collId: string) {
        if (isNullOrUndefined(collId)) {
            throw new BadRequestException(`This request requires the collection ID.`);
        }
        return await this.collections.setPrivate(user, collId);
    }
}
