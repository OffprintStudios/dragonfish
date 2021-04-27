import { ContentKind } from '../content';

export interface CreateComment {
    readonly body: string;
    readonly commentParentKind: ContentKind;
}
