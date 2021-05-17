import { CreateFandomTag, FandomTagModel } from '@dragonfish/shared/models/content';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FandomTagStore } from '../../db/content/prose/fandom-tag.store';
import { IFandomTag } from '../../shared/content/fandom-tag.interface';

@Injectable()
export class FandomTagService implements IFandomTag {
    private readonly logger: Logger = new Logger(FandomTagService.name);

    constructor(
        private readonly fandomTag: FandomTagStore
    ) { }

    async createFandomTag(fandomTagInfo: CreateFandomTag): Promise<FandomTagModel> {
        return await this.fandomTag.createFandomTag(fandomTagInfo)
    }
}