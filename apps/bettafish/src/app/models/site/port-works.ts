import { PoetryContent, ProseContent } from '@dragonfish/shared/models/content';
import { PaginateResult } from '@dragonfish/shared/models/util';

export interface PortWorks {
    prose: PaginateResult<ProseContent>;
    poetry: PaginateResult<PoetryContent>;
}
