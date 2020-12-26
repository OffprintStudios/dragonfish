import { ContentKind, ContentRating, Genres, PubStatus, WorkKind, WorkStatus } from "../content";

export interface MigrationForm {
    readonly _id: string;
    readonly title: string;
    readonly author: string;
    readonly desc?: string;
    readonly body: string;
    readonly sections?: string[];
    readonly meta: {
        readonly rating: ContentRating;
        readonly category?: WorkKind;
        readonly genres?: Genres[];
        readonly status?: WorkStatus;
        readonly coverArt?: string;
    };
    readonly stats: {
        readonly words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly comments: number;
    };
    readonly published: PubStatus;
    readonly publishedOn?: Date;
    readonly kind: ContentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
