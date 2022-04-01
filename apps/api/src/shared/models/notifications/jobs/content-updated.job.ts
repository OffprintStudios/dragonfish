import { Subscription } from '../subscription';

export interface ContentUpdatedJob {
    readonly contentId: string;
    readonly subscribers: Subscription[];
}
