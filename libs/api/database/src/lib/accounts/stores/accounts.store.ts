import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument } from '../schemas';
import { AccountForm, ChangeEmail, ChangePassword, FrontendAccount, Account } from '@dragonfish/shared/models/accounts';
import * as sanitizeHtml from 'sanitize-html';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { argon2id, hash } from 'argon2';
import { DeviceInfo } from '@dragonfish/api/utilities/models';
import { createHash } from 'crypto';
import { PseudonymDocument } from '../schemas';

@Injectable()
export class AccountsStore {
    constructor(@InjectModel('Account') private readonly accountModel: Model<AccountDocument>) {}

    //#region ---FETCH ACCOUNTS---

    public async fetchAccountById(id: string): Promise<AccountDocument> {
        return this.retrieveAccount(id);
    }

    public async fetchAccountByEmail(email: string): Promise<AccountDocument> {
        return this.accountModel.findOne({ email: sanitizeHtml(email) });
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public async createAccount(formInfo: AccountForm): Promise<AccountDocument> {
        const newAccount = new this.accountModel({
            email: formInfo.email,
            password: formInfo.password,
            termsAgree: formInfo.termsAgree,
        });

        return await newAccount.save();
    }

    public async updateEmail(accountId: string, formInfo: ChangeEmail): Promise<AccountDocument> {
        const account = await this.retrieveAccount(accountId);
        account.email = sanitizeHtml(formInfo.newEmail);
        return await account.save();
    }

    public async updatePassword(accountId: string, formInfo: ChangePassword) {
        const account = await this.retrieveAccount(accountId);
        const hashedPw = await hash(sanitizeHtml(formInfo.newPassword), { type: argon2id });

        account.password = sanitizeHtml(hashedPw);
        return await account.save();
    }

    public async addPseudonym(accountId: string, pseudId: string) {
        const account = await this.retrieveAccount(accountId);
        account.pseudonyms.push(pseudId as any);
        return await account.save();
    }

    //#endregion

    //#region ---AUTH---

    public async saveSession(
        accountId: string,
        sessionId: string,
        deviceInfo: DeviceInfo,
        expiration: Date,
    ): Promise<AccountDocument> {
        const account = await this.retrieveAccount(accountId);
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');
        account.sessions.push({
            _id: hashedSessionId,
            expires: expiration,
            deviceOS: deviceInfo.os,
            deviceBrowser: deviceInfo.browser,
            ipAddr: deviceInfo.ipAddr,
        } as any);

        return await account.save();
    }

    public async removeSession(accountId: string, sessionId: string): Promise<AccountDocument> {
        const account = await this.retrieveAccount(accountId);
        account.sessions = account.sessions.filter((x) => {
            return x._id !== sessionId;
        });
        return await account.save();
    }

    public async checkSession(accountId: string, sessionId: string): Promise<boolean> {
        const validAccount = await this.accountModel.findOne({ _id: accountId, 'sessions._id': sessionId });
        return !!validAccount;
    }

    //#endregion

    //#region ---EXTRA---

    public async createFrontendAccount(account: Account): Promise<FrontendAccount> {
        return {
            _id: account._id,
            pseudonyms: account.pseudonyms as PseudonymDocument[],
            roles: account.roles,
            termsAgree: account.termsAgree,
            emailConfirmed: account.emailConfirmed,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        };
    }

    //#endregion

    //#region ---PRIVATE---

    private async retrieveAccount(accountId: string): Promise<AccountDocument> {
        const account = await this.accountModel.findById(accountId);

        if (isNullOrUndefined(account)) {
            throw new NotFoundException(`The account you're looking for doesn't exist.`);
        }

        return account;
    }

    //#endregion
}
