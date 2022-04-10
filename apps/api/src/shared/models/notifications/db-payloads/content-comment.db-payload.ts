import { ContentKind } from '$shared/models/content';

export interface ContentCommentDbPayload {
    readonly recipientId: string;
    readonly commentId: string;
    readonly poster: {
        readonly id: string;
        readonly name: string;
        readonly tag: string;
    };
    readonly content: {
        readonly id: string;
        readonly title: string;
        readonly kind: ContentKind;
    };
}
