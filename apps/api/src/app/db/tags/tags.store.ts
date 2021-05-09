import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { TagsForm } from '@dragonfish/shared/models/tags';
import { TagsDocument } from './tags.schema';
import { isNullOrUndefined } from '../../util';
import { ContentModel } from '@dragonfish/shared/models/content';

@Injectable()
export class TagsStore {
    constructor(@InjectModel('Tags') private readonly tagsModel: PaginateModel<TagsDocument>) {}

    /**
     * Creates a tags and saves it to the database.
     *
     * @param collForm The tag's information
     */
     async createTag(tagsForm: TagsForm): Promise<TagsDocument> {
        const newTag = new this.tagsModel({
            name: sanitizeHtml(tagsForm.name),
            desc: sanitizeHtml(tagsForm.desc),
            parent: sanitizeHtml(tagsForm.parent),
            children: tagsForm.children,
        });

        return await newTag.save();
    }
}
