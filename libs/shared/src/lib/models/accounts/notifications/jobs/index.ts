export { ContentCommentJob } from './content-comment.job';
export { AddedToLibraryJob } from './added-to-library.job';

import { ContentCommentJob } from './content-comment.job';
import { AddedToLibraryJob } from './added-to-library.job';

export type JobType = ContentCommentJob | AddedToLibraryJob;
