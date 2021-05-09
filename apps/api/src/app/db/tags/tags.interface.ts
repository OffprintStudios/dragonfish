import { PaginateResult } from 'mongoose';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { Tag, TagsForm } from '@dragonfish/shared/models/tags';

export interface ITags {
    
    create(tagInfo: TagsForm): Promise<Tag>;
}
