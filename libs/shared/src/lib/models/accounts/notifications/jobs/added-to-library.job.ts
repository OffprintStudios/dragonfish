import { ContentKind } from '../../../content';
import { Pseudonym } from '../../psuedonyms';

export interface AddedToLibraryJob {
    readonly recipientId: string;
    readonly contentId: string;
    readonly contentTitle: string;
    readonly contentKind: ContentKind;
    readonly addedBy: Pseudonym;
}
