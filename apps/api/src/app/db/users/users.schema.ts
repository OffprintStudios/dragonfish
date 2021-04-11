import { Schema, HookNextFunction } from 'mongoose';
import { nanoid } from 'nanoid';
import { hash, argon2id } from 'argon2';
import * as sanitizeHtml from 'sanitize-html';

import { Roles } from '@dragonfish/shared/models/users';
import { AuditSessionSchema } from './audit-session.schema';
import { UserDocument } from './models';

export const UsersSchema = new Schema(
    {
        _id: { type: String, default: () => nanoid() },
        email: { type: String, trim: true, required: [true, 'You must provide a valid email.'], unique: true },
        username: { type: String, trim: true, required: [true, 'You must provide a valid username.'], unique: true },
        password: { type: String, trim: true, required: true },
        agreedToPolicies: { type: Boolean, required: true, default: false },
        profile: {
            avatar: { type: String, trim: true, default: 'https://images.offprint.net/avatars/avatar.png' },
            themePref: { type: String, default: 'crimson' },
            bio: { type: String, trim: true, default: null },
            tagline: { type: String, trim: true, default: null },
        },
        stats: {
            works: { type: Number, default: 0 },
            blogs: { type: Number, default: 0 },
            watchers: { type: Number, default: 0 },
            watching: { type: Number, default: 0 },
        },
        audit: {
            roles: { type: [String], enum: Object.keys(Roles), default: ['User'] },
            sessions: { type: [AuditSessionSchema], default: null },
            termsAgree: { type: Boolean, default: false },
            emailConfirmed: { type: Boolean, default: false },
            isDeleted: { type: String, default: false },
        },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
    },
    { timestamps: true, autoIndex: true, collection: 'users' }
);

UsersSchema.index({ username: 'text' });

UsersSchema.plugin(require('mongoose-paginate-v2'));

UsersSchema.pre<UserDocument>('save', async function (next: HookNextFunction) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPw = await hash(this.password, { type: argon2id });
        this.set('email', sanitizeHtml(this.email));
        this.set('username', sanitizeHtml(this.username));
        this.set('password', hashedPw);
        this.set('createdAt', Date.now());
        this.set('updatedAt', Date.now());
        return next();
    } catch (err) {
        return next(err);
    }
});
