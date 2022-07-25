import { Pronouns } from '../pronouns';
import { Presence } from '../presence';

export interface PseudonymForm {
  readonly userTag: string;
  readonly screenName?: string;
  readonly pronouns: Pronouns[];
  readonly tagline?: string;
  readonly bio?: string;
  readonly presence?: Presence;
}
