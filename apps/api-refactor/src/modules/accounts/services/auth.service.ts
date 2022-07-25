import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsStore, SessionsStore } from '../db/stores';
import { Account, AccountForm, DeviceInfo, FrontendAccount, LoginForm } from '$shared/models/accounts';
import { argon2id, verify } from 'argon2';
import { Request, Response } from 'express';
import * as UAParser from 'ua-parser-js';
import { AccessPayload, LoginPackage } from '$shared/auth';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly accounts: AccountsStore, private readonly sessions: SessionsStore) {}

  //#region ---AUTHENTICATION---

  /**
   * Retrieves a user's device info from the provided user agent.
   *
   * @param userAgent
   * @param ipAddress
   * @private
   */
  private static async getDeviceInfo(userAgent: string, ipAddress: string): Promise<DeviceInfo> {
    const info = new UAParser(userAgent);

    return {
      ipAddr: ipAddress,
      os: `${info.getOS().name} ${info.getOS().version}`,
      browser: `${info.getBrowser().name} ${info.getBrowser().version}`,
    };
  }

  /**
   * Initializes user registration based on the provided `AccountForm` details.
   *
   * @param request
   * @param formInfo
   */
  public async register(request: Request, formInfo: AccountForm): Promise<LoginPackage> {
    const validCode = await this.accounts.findOneInviteCode(formInfo.inviteCode);

    if (validCode !== null) {
      const newUser = await this.accounts.createAccount(formInfo);
      await this.accounts.useInviteCode(formInfo.inviteCode, newUser._id);
      this.logger.log(`New user created with ID: ${newUser._id}`);
      return await this.processLogin(newUser, request, true);
    } else {
      throw new BadRequestException(`You need a valid invite code to register.`);
    }
  }

  /**
   * Logs a user in using the credentials provided by `Login`. If no valid account is found,
   * an error is returned. Likewise, if the provided password does not match our records, or
   * something has otherwise gone wrong with the verification process, an error is returned.
   *
   * @param request
   * @param formInfo
   */
  public async login(request: Request, formInfo: LoginForm): Promise<LoginPackage> {
    const notFoundError = `The email and password provided do not match our records.`;

    const existingAccount = await this.accounts.fetchAccountByEmail(formInfo.email);

    if (!existingAccount) {
      throw new NotFoundException(notFoundError);
    }

    let isVerified = false;

    try {
      isVerified = await verify(existingAccount.password, formInfo.password, {
        type: argon2id,
      });
    } catch (e) {
      this.logger.error(`Failed to process verification correctly!`);
      throw new NotFoundException(notFoundError);
    }

    if (isVerified) {
      return await this.processLogin(existingAccount, request, formInfo.rememberMe);
    } else {
      throw new NotFoundException(notFoundError);
    }
  }

  //#endregion

  //#region ---MISC---

  /**
   * Logs a user out, first by checking to see if any `accessToken` cookie exists in the browser
   * and clearing that. If none exist, return. Otherwise, use the `existingAccessToken` payload
   * to determine a valid session for the user and remove it from both the database and the
   * browser's cookie storage.
   *
   * @param request
   * @param response
   */
  public async logout(request: Request, response: Response): Promise<void> {
    const existingAccessToken: AccessPayload = JSON.parse(request.cookies['accessToken']);

    if (!existingAccessToken) {
      return;
    } else {
      await this.sessions.deleteSession(existingAccessToken);
      response.clearCookie('accessToken');
      return;
    }
  }

  //#endregion

  //#region ---PRIVATE---

  /**
   * Creates a frontend account, removing sensitive information.
   *
   * @param account
   */
  public async createFrontendAccount(account: Account): Promise<FrontendAccount> {
    return await this.accounts.createFrontendAccount(account);
  }

  /**
   * Process login information to create a valid `Session` for a given account. Once a session is
   * created, an `accessToken` is added to cookie storage containing the session ID. If a user has
   * chosen to create a long-running session, the expiration date is set to one month after initial
   * creation.
   *
   * @param account
   * @param req
   * @param session
   * @private
   */
  private async processLogin(account: Account, req: Request, session: boolean): Promise<LoginPackage> {
    const device = await AuthService.getDeviceInfo(req.headers['user-agent'], req.ip);

    const sessionId = await this.sessions.createSession(
      account._id,
      device,
      session ? new Date(Date.now() + 2592000000) : new Date(Date.now() + 3600),
    );

    const accessToken = sign({ accountId: account._id, sessionId: sessionId }, process.env.JWT_SECRET);

    return {
      account: await this.createFrontendAccount(await this.accounts.fetchAccountById(account._id)),
      accessToken,
    };
  }

  //#endregion
}
