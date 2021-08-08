import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Pronouns, Presence, Pseudonym } from '@dragonfish/shared/models/accounts/psuedonyms';
import { Roles } from '@dragonfish/shared/models/accounts/audit';

@Schema({ timestamps: true, collection: 'pseudonyms', autoIndex: true })
export class PseudonymDocument extends Document implements Pseudonym {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, required: true, ref: 'Account' })
    readonly accountId: string;

    @Prop({ type: String, required: true, index: 'text', unique: true })
    userTag: string;

    @Prop({ type: String })
    screenName: string;

    @Prop(
        raw({
            avatar: { type: String, trim: true, default: 'https://images.offprint.net/avatars/avatar.png' },
            bio: { type: String, trim: true, default: null },
            tagline: { type: String, trim: true, default: null },
            coverPic: { type: String, trim: true, default: null },
            pronouns: { type: [String], enum: Object.keys(Pronouns), default: [] },
        }),
    )
    profile: {
        avatar: string;
        bio: string;
        tagline: string;
        coverPic: string;
        pronouns: Pronouns[];
    };

    @Prop(
        raw({
            works: { type: Number, default: 0 },
            blogs: { type: Number, default: 0 },
            watchers: { type: Number, default: 0 },
            watching: { type: Number, default: 0 },
        }),
    )
    stats: {
        works: number;
        blogs: number;
        watchers: number;
        watching: number;
    };

    @Prop({ type: String, enum: Object.keys(Presence), default: Presence.Offline })
    presence: Presence;

    @Prop({ type: String, enum: Object.keys(Roles), default: Roles.User })
    roles: Roles[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const PseudonymSchema = SchemaFactory.createForClass(PseudonymDocument);
