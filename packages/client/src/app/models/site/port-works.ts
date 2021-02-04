import { PoetryContent, ProseContent } from '@dragonfish/models/content';
import { PaginateResult } from '@dragonfish/models/util';

export interface PortWorks {
    prose: PaginateResult<ProseContent>,
    poetry: PaginateResult<PoetryContent>
}