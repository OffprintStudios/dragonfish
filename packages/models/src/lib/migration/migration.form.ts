import { ContentKind, ContentRating, PubStatus } from "../content";

export interface MigrationForm {
    readonly title: string;
    readonly author: string;
    readonly desc?: string;
    readonly body: string;
    readonly rating: ContentRating;
    readonly stats: {
        readonly words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
    };
    readonly published: PubStatus;
    readonly publishedOn?: Date;
    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
