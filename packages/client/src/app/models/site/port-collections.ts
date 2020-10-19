import { PaginateResult } from '@pulp-fiction/models/util';
import { Collection } from '@pulp-fiction/models/collections';

export interface PortCollections {
    collections: PaginateResult<Collection>;
    userCollections: PaginateResult<Collection>;
}