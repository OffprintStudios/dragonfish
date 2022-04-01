import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, InviteCodesDocument } from '../schemas';
import {
    AccountForm,
    ChangeEmail,
    ChangePassword,
    Roles,
    ResetPassword,
    Account,
    FrontendAccount,
    Pseudonym,
    InviteCodes,
} from '$shared/models/accounts';
import sanitizeHtml from 'sanitize-html';
import { DeviceInfo } from '$shared/util';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

@Injectable()
export class AccountsStore {
    constructor(
        @InjectModel('Account') private readonly accountModel: Model<AccountDocument>,
        @InjectModel('InviteCodes') private readonly inviteCodesModel: Model<InviteCodesDocument>,
    ) {}

    //#region ---FETCH ACCOUNTS---

    public async fetchAccountById(id: string): Promise<AccountDocument> {
        return this.retrieveAccount(id);
    }

    public async fetchAccountByEmail(email: string): Promise<AccountDocument> {
        return this.accountModel.findOne({ email: sanitizeHtml(email) });
    }

    public async fetchRoles(id: string): Promise<Roles[]> {
        const thisUser: AccountDocument = await this.accountModel.findById(id);
        return thisUser.roles;
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

        account.password = sanitizeHtml(formInfo.newPassword);
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
        const validAccount = await this.accountModel.findOne({
            _id: accountId,
            'sessions._id': sessionId,
        });
        return !!validAccount;
    }

    public async createRecoveryCode(accountId: string) {
        const account = await this.retrieveAccount(accountId);
        const resetCode = nanoid();
        account.recovery.resetCode = resetCode;
        account.recovery.expires = new Date(Date.now() + 1800);
        await account.save();
        return resetCode;
    }

    public async verifyResetAndUpdatePassword(resetForm: ResetPassword) {
        const account = await this.retrieveAccount(resetForm.accountId);
        if (account.recovery) {
            if (account.recovery.resetCode && account.recovery.expires) {
                if (
                    account.recovery.resetCode === resetForm.resetCode &&
                    account.recovery.expires.valueOf() < Date.now()
                ) {
                    account.password = sanitizeHtml(resetForm.newPassword);
                    account.recovery.resetCode = null;
                    account.recovery.expires = null;
                    await account.save();
                    return true;
                } else {
                    account.recovery.resetCode = null;
                    account.recovery.expires = null;
                    await account.save();
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //#endregion

    //#region ---EXTRA---

    public async createFrontendAccount(account: Account): Promise<FrontendAccount> {
        return {
            _id: account._id,
            pseudonyms: account.pseudonyms as Pseudonym[],
            roles: account.roles,
            termsAgree: account.termsAgree,
            emailConfirmed: account.emailConfirmed,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        };
    }

    /**
     * Return the invite code with the given ID.
     * @param codeId The ID of the invite code to look for.
     */
    async findOneInviteCode(codeId: string): Promise<InviteCodes> {
        return this.inviteCodesModel.findById(sanitizeHtml(codeId));
    }

    /**
     * Marks the code with the given ID as used, preventing it from being used by anyone else.
     * @param codeId The ID of the code to mark as used.
     * @param usedById Which user used this code
     */
    async useInviteCode(codeId: string, usedById: string): Promise<void> {
        await this.inviteCodesModel.findOneAndUpdate(
            { _id: codeId },
            { byWho: usedById, used: true },
        );
    }

    async createInviteCode(): Promise<InviteCodes> {
        const newCode = new this.inviteCodesModel({
            _id: nanoid(),
            byWho: null,
            used: false,
        });
        return newCode.save();
    }

    //#endregion

    //#region ---PRIVATE---

    private async retrieveAccount(accountId: string): Promise<AccountDocument> {
        const account = await this.accountModel.findById(accountId);

        if (account === null || account === undefined) {
            throw new NotFoundException(`The account you're looking for doesn't exist.`);
        }

        return account;
    }

    //#endregion
}
