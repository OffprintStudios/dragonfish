import { AuthorsNotePos } from './authors-note-pos.enum';

export interface SectionForm {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly authorsNotePos?: AuthorsNotePos;
    
     // Remove this once we've migrated all sections from Quill
    readonly usesNewEditor: boolean;
}
