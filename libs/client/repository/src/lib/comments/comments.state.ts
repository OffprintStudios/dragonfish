import { EntityState } from '@datorama/akita';
import { Comment } from '@dragonfish/shared/models/comments';

export type CommentsState = EntityState<Comment, string>;
