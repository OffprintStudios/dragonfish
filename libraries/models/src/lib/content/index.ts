import { BlogForm } from './blogs';
import { NewsForm } from './news';
import { CreatePoetry } from './poetry';
import { CreateProse } from './prose';

export { ContentModel } from './content.model';
export { ContentKind } from './content-kind.enum';
export { ContentRating } from './content-rating.enum';
export { ContentWarning } from './content-warning.enum';
export { PubStatus } from './pub-status.enum';
export { Genres } from './genres.enum';
export { SectionInfo } from './section-info.model';
export { WorkKind } from './work-kind.enum';
export { WorkStatus } from './work-status.enum';
export { ContentFilter } from './content-filter.enum';
export { SetRating } from './set-rating.model';

export * from './news';
export * from './blogs';
export * from './prose';
export * from './poetry';

export type FormType = CreateProse | CreatePoetry | BlogForm | NewsForm;