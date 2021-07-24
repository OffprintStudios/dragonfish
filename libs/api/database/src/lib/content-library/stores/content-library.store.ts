import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentLibraryDocument } from '../schemas';

@Injectable()
export class ContentLibraryStore {
    constructor(@InjectModel('ContentLibrary') private readonly library: Model<ContentLibraryDocument>) {}
}
