import { ContentKind } from '@pulp-fiction/models/content';
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

    export function getBlogNotification(): SchemaDefinition {
        return {
            authorId: { type: String, trim: true, required: true },
            authorName: { type: String, required: true },
        };
    }

    export function getCommentNotification(): SchemaDefinition {
        return {
            commentId: { type: String, required: true, trim: true },
            commenterName: { type: String, required: true },
            commenterId: { type: String, required: true, trim: true },
            parentKind: { type: String, required: true, enum: Object.keys(ContentKind), default: ContentKind.ProseContent },            
            parentTitle: { type: String, required: true }
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
