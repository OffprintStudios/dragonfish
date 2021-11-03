export { ContentCommentJob } from './content-comment.job';
export { AddedToLibraryJob } from './added-to-library.job';
export { ContentUpdatedJob } from './content-updated.job';

import { ContentCommentJob } from './content-comment.job';
import { AddedToLibraryJob } from './added-to-library.job';
import { ContentUpdatedJob } from './content-updated.job';

export type JobType = ContentCommentJob | AddedToLibraryJob | ContentUpdatedJob;
