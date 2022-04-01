import type { Content } from '../content';

export interface ContentLibrary {
	readonly _id: string;
	readonly userId: string;
	readonly content: Content;
	readonly createdAt: Date;
}
