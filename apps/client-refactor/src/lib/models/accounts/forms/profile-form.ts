import type { Pronouns } from '../pronouns';

export interface ProfileForm {
    readonly userTag: string;
    readonly screenName?: string;
    readonly pronouns: Pronouns[];
}
