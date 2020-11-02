import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { PoetryContentDocument } from './poetry-content.document';

@Injectable()
export class PoetryService {
    constructor(@InjectModel('PoetryContent') private readonly poetryModel: PaginateModel<PoetryContentDocument>) {}
}
