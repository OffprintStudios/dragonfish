import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { ProseContentDocument } from './prose-content.document';

@Injectable()
export class ProseService {
    constructor(@InjectModel('ProseContent') private readonly proseModel: PaginateModel<ProseContentDocument>) {}
}
