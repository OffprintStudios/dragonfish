import { CreateFandomTag } from '@dragonfish/shared/models/content';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FandomTagDocument } from './fandom-tag.document';

@Injectable()
export class FandomTagStore {
    constructor(
        @InjectModel('FandomTag')
        private readonly fandomTagModel: PaginateModel<FandomTagDocument>
    ) {}

    /**
     * Creates a new fandom tag given `fandomTagInfo` and adds it to the database.
     *
     * @param fandomTagInfo The fandom tag info
     */
     async createFandomTag(fandomTagInfo: CreateFandomTag): Promise<FandomTagDocument> {
        const newFandomTag = new this.fandomTagModel({
            name: fandomTagInfo.name,
            desc: fandomTagInfo.desc,
            parent: fandomTagInfo.parent,
            children: fandomTagInfo.children,
        });

        const savedFandomTag: FandomTagDocument = await newFandomTag.save();

        return savedFandomTag;
    }
}