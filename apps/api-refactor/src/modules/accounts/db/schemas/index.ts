import { AccountDocument, AccountSchema } from './account.schema';
import { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
import { RecoverySchema } from './recovery.schema';
import { SessionSchema } from './session.schema';
import { InviteCodesSchema } from './invite-code.schema';
import { argon2id, hash } from 'argon2';
import { htmlReplace, SANITIZE_OPTIONS } from '$shared/util';
import * as sanitizeHtml from 'sanitize-html';
import * as mongoosePaginate from 'mongoose-paginate-v2';

//#region ---EXPORTS---

export { AccountDocument, AccountSchema } from './account.schema';
export { PseudonymDocument, PseudonymSchema } from './pseudonym.schema';
export { SessionDocument, SessionSchema } from './session.schema';
export { RecoveryDocument, RecoverySchema } from './recovery.schema';
export { InviteCodesDocument, InviteCodesSchema } from './invite-code.schema';

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

  schema.plugin(mongoosePaginate);
  return schema;
}

export async function setupPseudonymCollection() {
  const schema = PseudonymSchema;

  schema.pre<PseudonymDocument>('save', async function (next) {
    if (this.isModified('userTag')) {
      this.set('userTag', htmlReplace(sanitizeHtml(this.userTag)));
    }

    if (this.isModified('screenName')) {
      this.set('screenName', htmlReplace(sanitizeHtml(this.screenName)));
    }

    if (this.isModified('profile.bio')) {
      this.set(
        'profile.bio',
        htmlReplace(sanitizeHtml(this.profile.bio, SANITIZE_OPTIONS)),
      );
    }

    if (this.isModified('profile.tagline')) {
      this.set(
        'profile.tagline',
        htmlReplace(sanitizeHtml(this.profile.tagline)),
      );
    }

    return next();
  });

  schema.plugin(mongoosePaginate);
  return schema;
}

export async function setupSessionCollection() {
  return SessionSchema;
}

export async function setupRecoveryCollection() {
  return RecoverySchema;
}

export async function setupInviteCodesCollection() {
  return InviteCodesSchema;
}

//#endregion
