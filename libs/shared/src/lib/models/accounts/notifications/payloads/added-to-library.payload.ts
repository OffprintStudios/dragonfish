import { Pseudonym } from '../../psuedonyms';

export interface AddedToLibraryPayload {
    readonly contentId: string;
    readonly addedBy: Pseudonym;
}
