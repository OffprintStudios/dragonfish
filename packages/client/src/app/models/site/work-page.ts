import { Work } from '@pulp-fiction/models/works';
import { History } from '@pulp-fiction/models/history';

export interface WorkPageData {
    readonly work: Work;
    readonly history: History;
}