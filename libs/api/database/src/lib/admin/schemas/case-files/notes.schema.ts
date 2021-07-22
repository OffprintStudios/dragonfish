import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Note } from '@dragonfish/shared/models/case-files';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { nanoid } from 'nanoid';
import { Constants } from '@dragonfish/shared/constants';

@Schema({ timestamps: true, autoIndex: true })
export class NotesDocument extends Types.Subdocument implements Note {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({
        type: String,
        ref: 'User',
        autopopulate: {
            select: Constants.USER_QUERY,
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
