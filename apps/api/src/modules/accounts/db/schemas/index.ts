import { AccountDocument, AccountSchema } from './account.schema';
import { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
import sanitizeHtml from 'sanitize-html';
import { argon2id, hash } from 'argon2';
import { sanitizeOptions } from '$shared/util';
import { InviteCodesSchema } from './invite-codes.schema';
import paginate from 'mongoose-paginate-v2';

/**
 * NOTE: MongooseUniqueValidator has been commented out because a current bug
 * with the latest version prevents it from working correctly, e.g. whenever a
 * document is saved, it counts the document's `_id` as a violation of the unique
 * constraint, even though it isn't.
 *
 * It will be re-enabled in a future update.
 */

//#region ---EXPORTS---

export { AccountDocument, AccountSchema } from './account.schema';
export { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
export { SessionInfoDocument, SessionInfoSchema } from './session-info.schema';
export { InviteCodesDocument, InviteCodesSchema } from './invite-codes.schema';

//#endregion

//#region ---SCHEMA FACTORIES---

export async function setupAccountCollection() {
    const schema = AccountSchema;

    schema.pre<AccountDocument>('save', async function (next) {
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(paginate);
    //schema.plugin(MongooseUniqueValidator);
    return schema;
}

export async function setupPseudonymCollection() {
    const schema = PseudonymSchema;

    schema.pre<PseudonymDocument>('save', async function (next) {
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(paginate);
    //schema.plugin(MongooseUniqueValidator);
    return schema;
}

export async function setupInviteCodesCollection() {
    const schema = InviteCodesSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
}

//#endregion
