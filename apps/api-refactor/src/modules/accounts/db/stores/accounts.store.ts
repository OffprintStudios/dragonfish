import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, InviteCodesDocument } from '../schemas';
import {
  Account,
  AccountForm,
  ChangeEmail,
  ChangePassword,
  FrontendAccount,
  InviteCodes,
  Pseudonym,
  Roles,
} from '$shared/models/accounts';
import * as sanitizeHtml from 'sanitize-html';
import { nanoid } from 'nanoid';

@Injectable()
export class AccountsStore {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel('InviteCodes')
    private readonly inviteCodesModel: Model<InviteCodesDocument>,
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
    await this.inviteCodesModel.findOneAndUpdate({ _id: codeId }, { byWho: usedById, used: true });
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
    const account = await this.accountModel.findById(accountId).populate('pseudonyms');

    if (account === null || account === undefined) {
      throw new NotFoundException(`The account you're looking for doesn't exist.`);
    }

    return account;
  }

  //#endregion
}
