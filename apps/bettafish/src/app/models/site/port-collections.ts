import { PaginateResult } from '@dragonfish/shared/models/util';
import { Collection } from '@dragonfish/shared/models/collections';

export interface PortCollections {
    collections: PaginateResult<Collection>;
    userCollections: PaginateResult<Collection>;
}
