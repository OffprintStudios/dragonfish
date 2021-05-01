import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { AuditSession, Roles, User } from '@dragonfish/shared/models/users';
import { AuditSessionSchema } from './audit-session.schema';

@Schema({ timestamps: true, autoIndex: true, collection: 'users' })
export class UserDocument extends Document implements User {
    @Prop({ type: String, default: () => nanoid() }) readonly _id: string;
    @Prop({ required: true, unique: true }) email: string;
    @Prop({ required: true, unique: true }) username: string;
    @Prop({ required: true }) password: string;

    @Prop(raw({
        avatar: { type: String, trim: true, default: 'https://images.offprint.net/avatars/avatar.png' },
        themePref: { type: String, default: 'crimson' },
        bio: { type: String, trim: true, default: null },
        tagline: { type: String, trim: true, default: null },
    }))
    profile: {
        avatar: string;
        bio: string;
        tagline: string;
    };

    @Prop(raw({
        works: { type: Number, default: 0 },
        blogs: { type: Number, default: 0 },
        watchers: { type: Number, default: 0 },
        watching: { type: Number, default: 0 },
    }))
    stats: {
        works: number;
        blogs: number;
        watchers: number;
        watching: number;
    }

    @Prop(raw({
        roles: { type: [String], enum: Object.keys(Roles), default: ['User'] },
        sessions: { type: [AuditSessionSchema], default: null },
        termsAgree: { type: Boolean, default: false },
        emailConfirmed: { type: Boolean, default: false },
        isDeleted: { type: String, default: false },
    }))
    audit: {
        roles: Roles[],
        sessions: AuditSession[],
        termsAgree: boolean,
        emailConfirmed: boolean,
        deleted: boolean,
    }

    @Prop() createdAt: Date;
    @Prop() updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
