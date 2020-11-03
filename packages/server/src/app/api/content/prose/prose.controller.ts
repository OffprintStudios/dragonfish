import { Controller, Put, UseGuards, Request, Body, Patch, Query, BadRequestException } from '@nestjs/common';

import { CreateProse } from '@pulp-fiction/models/content';
import { Roles } from '@pulp-fiction/models/users';
import { ContentService, ProseService } from '../../../db/content';
import { RolesGuard } from '../../../guards';
import { isNullOrUndefined } from '../../../util';

@Controller('prose')
export class ProseController {
    constructor(private readonly proseService: ProseService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Put('create-prose')
    async createProse(@Request() req: any, @Body() proseInfo: CreateProse) {
        return await this.proseService.createProse(req.user, proseInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-prose')
    async editProse(@Request() req: any, @Query('contentId') contentId: string, @Body() proseInfo: CreateProse) {
        if (isNullOrUndefined(contentId)) {
            throw new BadRequestException(`The content ID is required.`);
        }

        return await this.proseService.editProse(req.user, contentId, proseInfo);
    }
}