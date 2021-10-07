import { EntityState } from '@datorama/akita';
import { Comment } from '@dragonfish/shared/models/comments';

export interface CommentsState extends EntityState<Comment, string> {}
