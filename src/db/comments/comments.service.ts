import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as documents from './models';

@Injectable()
export class CommentsService {
    constructor(@InjectModel('BlogComment') blogCommentModel: Model<documents.BlogCommentDocument>,
        @InjectModel('WorkComment') workCommentModel: Model<documents.WorkCommentDocument>) {}

    
}
