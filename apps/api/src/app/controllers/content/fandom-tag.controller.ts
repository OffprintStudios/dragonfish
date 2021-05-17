import {
    Controller,
    UseGuards,
    Query,
    Get,
    BadRequestException,
    Patch,
    Body,
    Put,
    Post,
    Param,
    UseInterceptors,
    UploadedFile,
    Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IFandomTag } from '../../shared/content/fandom-tag.interface';
import { CreateFandomTag } from '@dragonfish/shared/models/content';

@Controller('fandom-tag')
export class FandomTagController {
    constructor(
        @Inject('IFandomTag') private readonly fandomTag: IFandomTag
    ) {}

    @ApiTags(DragonfishTags.FandomTag)
    @Put('create-fandom-tag')
    async createFandomTag(@Body() fandomTagInfo: CreateFandomTag) {
        return await this.fandomTag.createFandomTag(fandomTagInfo);
    }
}
