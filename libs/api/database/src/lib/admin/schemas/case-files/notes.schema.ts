import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Note } from '@dragonfish/shared/models/case-files';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Schema({ timestamps: true, autoIndex: true, _id: false })
export class NotesDocument extends Types.Subdocument implements Note {
    @Prop({ type: Number })
    readonly _id: number;

    @Prop({
        type: String,
        ref: 'User',
        autopopulate: {
            select:
                '-password -email -audit.sessions -audit.termsAgree -audit.emailConfirmed -audit.deleted -updatedAt',
        },
        required: true,
    })
    readonly user: string | FrontendUser;

    @Prop({ trim: true, required: true })
    body: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const NotesSchema = SchemaFactory.createForClass(NotesDocument);
