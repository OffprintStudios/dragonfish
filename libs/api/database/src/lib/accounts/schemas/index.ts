import { AccountDocument, AccountSchema } from './account.schema';
import { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { HookNextFunction } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { argon2id, hash } from 'argon2';

//#region ---EXPORTS---

export { AccountDocument, AccountSchema } from './account.schema';
export { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
export { SessionInfoDocument, SessionInfoSchema } from './session-info.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupAccountCollection() {
    const schema = AccountSchema;

    schema.pre<AccountDocument>('save', async function (next: HookNextFunction) {
        if (!this.isModified('password')) {
            return next();
        }
        try {
            const hashedPw = await hash(this.password, { type: argon2id });
            this.set('email', sanitizeHtml(this.email));
            this.set('password', hashedPw);
            return next();
        } catch (err) {
            return next(err);
        }
    });

    schema.plugin(MongooseAutopopulate);
    schema.plugin(MongoosePaginate);
    return schema;
}

export async function setupPseudonymCollection() {
    const schema = PseudonymSchema;

    schema.pre<PseudonymDocument>('save', async function (next: HookNextFunction) {
        if (this.isModified('userTag')) {
            this.set('userTag', sanitizeHtml(this.userTag));
        }

        if (this.isModified('screenName')) {
            this.set('screenName', sanitizeHtml(this.screenName));
        }

        if (this.isModified('profile.bio')) {
            this.set('profile.bio', sanitizeHtml(this.profile.bio, sanitizeOptions));
        }

        if (this.isModified('profile.tagline')) {
            this.set('profile.tagline', sanitizeHtml(this.profile.tagline));
        }

        return next();
    });

    schema.plugin(MongooseAutopopulate);
    schema.plugin(MongoosePaginate);
    return schema;
}

//#endregion
