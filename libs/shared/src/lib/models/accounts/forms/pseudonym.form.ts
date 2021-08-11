import { Pronouns } from '../psuedonyms';

export interface PseudonymForm {
    readonly userTag: string;
    readonly screenName?: string;
    readonly pronouns: Pronouns[];
}
