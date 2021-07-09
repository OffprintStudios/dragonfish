import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './users.schema';
import { UsersStore } from './users.store';
import { InviteCodesSchema } from './invite-codes.schema';
import { CollectionsModule } from '../collections/collections.module';
import { HookNextFunction } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { hash, argon2id } from 'argon2';

@Module({
    imports: [
        CollectionsModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'User',
                useFactory: () => {
                    const schema = UserSchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.index({ username: 'text' });
                    schema.pre<UserDocument>('save', async function (next: HookNextFunction) {
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
                    return schema;
                },
            },
            {
                name: 'InviteCodes',
                useFactory: () => {
                    const schema = InviteCodesSchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    return schema;
                },
            },
        ]),
    ],
    providers: [UsersStore],
    exports: [UsersStore],
})
export class UsersModule {}
