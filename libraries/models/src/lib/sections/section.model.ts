import { AuthorsNotePos } from './authors-note-pos.enum';

export interface Section {
    readonly _id: string;
    title: string;
    body: string;
    authorsNote?: string;
    authorsNotePos?: AuthorsNotePos;
    published: boolean;
    stats: {
        words: number;
    };
    audit: {
        publishedOn: Date;
        readonly isDeleted: boolean;
    };
    readonly usesNewEditor: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
