import { PaginateResult } from '@dragonfish/models/util';
import { Collection } from '@dragonfish/models/collections';

export interface PortCollections {
    collections: PaginateResult<Collection>;
    userCollections: PaginateResult<Collection>;
}