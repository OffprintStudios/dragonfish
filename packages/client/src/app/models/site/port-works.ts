import { PaginateResult } from '@pulp-fiction/models/util';
import { Work } from '@pulp-fiction/models/works';

export interface PortWorks {
    works: PaginateResult<Work>,
    userWorks: PaginateResult<Work>
}