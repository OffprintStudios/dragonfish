import { Injectable, Logger } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { TagsStore } from './tags.store';
import { Tag, TagsForm } from '@dragonfish/shared/models/tags';
import { ITags } from './tags.interface';

@Injectable()
export class TagsService implements ITags {

    constructor(private readonly tags: TagsStore) {}

    async create(tagInfo: TagsForm): Promise<Tag> {
        return await this.tags.createTag(tagInfo);
    }
}
