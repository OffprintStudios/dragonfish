import { PoetryContent, ProseContent } from '@pulp-fiction/models/content';
import { PaginateResult } from '@pulp-fiction/models/util';

export interface PortWorks {
    prose: PaginateResult<ProseContent>,
    poetry: PaginateResult<PoetryContent>
}