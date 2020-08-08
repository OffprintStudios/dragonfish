import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';
import { hash, argon2id } from 'argon2';
import * as sanitize from 'sanitize-html';

import { User, Roles } from './models';
import { AuditSessionSchema } from './audit-session.schema';

export const UsersSchema = new Schema({
    _id: {type: String, default: generate()},
    email: {type: String, trim: true, required: [true, 'You must provide a valid email.'], unique: true},
    username: {type: String, trim: true, required: [true, 'You must provide a valid username.'], unique: true},
    password: {type: String, trim: true, required: true},
    profile: {
        avatar: {type: String, trim: true, default: 'https://images.offprint.net/avatars/avatar.png'},
        themePref: {type: String, default: 'crimson'},
        bio: {type: String, trim: true, default: null},
        tagline: {type: String, trim: true, default: null},
    },
    stats: {
        works: {type: Number, default: 0},
        blogs: {type: Number, default: 0},
        watchers: {type: Number, default: 0},
        watching: {type: Number, default: 0},
    },
    audit: {
        roles: {type: [String], enum: Object.keys(Roles), default: ['User']},
        sessions: {type: [AuditSessionSchema], default: null},
        isDeleted: {type: String, default: false},
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
}, {timestamps: true, autoIndex: true, collection: 'users'});

UsersSchema.pre<User>('save', async function(next: HookNextFunction) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const hashedPw = await hash(user.password, {type: argon2id});
        user.set('_id', generate());
        user.set('email', sanitize(user.email));
        user.set('username', sanitize(user.username));
        user.set('password', hashedPw);
        user.set('createdAt', Date.now());
        user.set('updatedAt', Date.now());
        
        return next();
    } catch (err) {
        return next(err);
    }
});