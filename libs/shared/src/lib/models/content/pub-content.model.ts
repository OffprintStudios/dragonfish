import { RatingsModel } from '../ratings';
import { PaginateResult } from '../util';
import { ContentModel } from './content.model';
import { Comment } from '../comments';

export interface PubContent {
    content: ContentModel;
    ratings: RatingsModel;
    comments: PaginateResult<Comment>;
}
