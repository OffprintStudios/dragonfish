import { ContentKind } from '@dragonfish/shared/models/content';
import { SchemaDefinition } from 'mongoose';

/**
 * Contains the extra pieces of schemas that get added onto a NotificationDocument
 * or a NotificationQueueDocument to get content-specific notifications.
 */
export namespace SubSchemas {
    export function getWorkNotification(): SchemaDefinition {
        return {
            // TBD
        };
    }

    export function getSectionNotification(): SchemaDefinition {
        return {
            // TBD
        };
    }


    interface BlogSubSchemaProps {
        authorId: typeof String;
        authorName: typeof String;
    }
    export function getBlogNotification(): SchemaDefinition<BlogSubSchemaProps> {
        return {
            authorId: { type: String, trim: true, required: true },
            authorName: { type: String, required: true },
        };
    }

    interface CommentNotificationSubSchemaProps {
        commentId: typeof String;
        commenterName: typeof String;
        parentKind: typeof String;
        parentTitle: typeof String;
    }

    export function getCommentNotification(): SchemaDefinition<CommentNotificationSubSchemaProps> {
        return {
            commentId: { type: String, required: true, trim: true },
            commenterName: { type: String, required: true },
            parentKind: {
                type: String,
                required: true,
                enum: Object.keys(ContentKind),
            },
            parentTitle: { type: String, required: true },
        };
    }

    export function getNewsPostNotification(): SchemaDefinition {
        return {
            // TBD
        };
    }

    export function getPMThreadNotification(): SchemaDefinition {
        return {
            // TBD
        };
    }

    export function getPMReplyNotification(): SchemaDefinition {
        return {
            // TBD
        };
    }
}
