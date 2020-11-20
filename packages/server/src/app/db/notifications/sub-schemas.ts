import { ContentKind } from '@pulp-fiction/models/content';
import { SchemaDefinition } from 'mongoose';

/**
 * Contains the extra pieces of schemas that get added onto a NotificationDocument
 * or a NotificationQueueDocument to get content-specific notifications.
 */
export namespace SubSchemas {

    export const WorkNotification: SchemaDefinition = {
        // TBD
    };

    export const SectionNotification: SchemaDefinition = {
        // TBD
    };    

    export const BlogNotification: SchemaDefinition = {
        authorId: { type: String, trim: true, required: true },
        authorName: { type: String, required: true },
    };

    export const CommentNotification: SchemaDefinition = {
        commenterName: { type: String, required: true },
        commenterId: { type: String, required: true, trim: true },
        parentKind: { type: String, required: true, enum: Object.keys(ContentKind), default: ContentKind.WorkContent },
        parentId: { type: String, required: true, trim: true },
        parentTitle: { type: String, required: true }
    }

    export const NewsPostNotification: SchemaDefinition = {
        // TBD
    };

    export const PMThreadNotification: SchemaDefinition = {
        // TBD
    };

    export const PMReplyNotification: SchemaDefinition = {
        // TBD
    }
}
