import type { AuthorsNotePos } from '../authors-note-pos';

export interface SectionForm {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly authorsNotePos?: AuthorsNotePos;
    readonly oldWords?: number;
}
