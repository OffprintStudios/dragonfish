import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActionType, CaseKind, CommentCaseFile } from '@dragonfish/shared/models/case-files';
import { ReportDocument } from './reports.schema';
import { NotesDocument } from './notes.schema';
import { Comment } from '@dragonfish/shared/models/comments';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Schema()
export class CommentCaseFileDocument extends Document implements CommentCaseFile {
    readonly _id: number;
    reports: ReportDocument[];
    notes: NotesDocument[];
    isClosed: boolean;
    claimedBy: string | Pseudonym;
    action: {
        hasType: ActionType;
        date: Date;
        reason: string;
    };
    readonly kind: CaseKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @Prop({ type: String, ref: 'Comments', autopopulate: true, required: true })
    comment: string | Comment;
}

export const CommentCaseFileSchema = SchemaFactory.createForClass(CommentCaseFileDocument);
