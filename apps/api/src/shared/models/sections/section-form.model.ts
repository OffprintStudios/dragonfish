import { AuthorsNotePos } from './authors-note-pos.enum';

export interface SectionForm {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly authorsNotePos?: AuthorsNotePos;
    readonly oldWords?: number;
}
