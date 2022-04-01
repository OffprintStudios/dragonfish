import { Pronouns } from '../pronouns';

export interface PseudonymForm {
    readonly userTag: string;
    readonly screenName?: string;
    readonly pronouns: Pronouns[];
}
