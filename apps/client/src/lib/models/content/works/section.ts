import type { AuthorsNotePos } from '../authors-note-pos';

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
	readonly createdAt: Date;
	readonly updatedAt: Date;
}
