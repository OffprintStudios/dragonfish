import { Controller, UseGuards, Body, Get, Put, Patch, Query, BadRequestException, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { Roles } from '@dragonfish/shared/models/users';
import { isNullOrUndefined } from '../../util';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ITags } from './tags.interface';
import { TagsForm } from '@dragonfish/shared/models/tags';

@Controller('tags')
export class TagsController {
    constructor(@Inject('ITags') private readonly tags: ITags) {}

    @ApiTags(DragonfishTags.Tags)
    @Put('create-tag')
    async createTag(@Body() tagInfo: TagsForm) {
        return await this.tags.create(tagInfo);
    }
}
