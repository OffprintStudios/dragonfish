import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { argon2id, verify } from 'argon2';
import { nanoid } from 'nanoid';
import { JwtPayload, LoginPackage } from '$shared/auth';
import { DeviceInfo, REFRESH_EXPIRATION } from '$shared/util';
import { AccountsStore, PseudonymsStore } from '../db/stores';
import {
    Account,
    AccountForm,
    PseudonymForm,
    Pseudonym,
    FrontendAccount,
    Roles,
} from '$shared/models/accounts';
import { createHash } from 'crypto';
import { intersection } from 'lodash';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(
        private readonly accountStore: AccountsStore,
        private readonly pseudStore: PseudonymsStore,
        private readonly jwtService: JwtService,
    ) {}

    //#region ---ACCOUNTS---

    public async validateAccount(email: string, password: string): Promise<Account | null> {
        const potentialAccount = await this.accountStore.fetchAccountByEmail(email);
        if (!potentialAccount) {
            throw new NotFoundException(
                `No user with those credentials found. Have you signed up?`,
            );
        }

        try {
            const verifyPassword = await verify(potentialAccount.password, password, {
                type: argon2id,
            });
            if (!verifyPassword) {
                this.logger.warn(
                    `Someone attempted to log into Account ${potentialAccount._id} and failed!`,
                );
                return null;
            }

            return potentialAccount;
        } catch (err) {
            throw new InternalServerErrorException(
                `Something went wrong! Code: sunfish. Details: ${err}`,
            );
        }
    }

    public async login(
        user: Account,
        req,
        device: DeviceInfo,
        rememberMe: boolean,
    ): Promise<LoginPackage> {
        const payload = await AuthService.createPayload(user);
        if (rememberMe) {
            const userWithSession = await this.createSession(user._id, req, device);
            return await AuthService.buildLoginPackage(
                this.jwtService.sign(payload),
                await this.accountStore.createFrontendAccount(userWithSession),
            );
        } else {
            return await AuthService.buildLoginPackage(
                this.jwtService.sign(payload),
                await this.accountStore.createFrontendAccount(user),
            );
        }
    }

    public async register(req, device: DeviceInfo, formInfo: AccountForm): Promise<LoginPackage> {
        console.log('Checking if invite code is valid: ' + formInfo.inviteCode);
        const validCode = await this.accountStore.findOneInviteCode(formInfo.inviteCode);

        if (validCode !== null) {
            console.log('Invite code is valid: ' + formInfo.inviteCode);
            const addedUser = await this.accountStore.createAccount(formInfo);
            await this.accountStore.useInviteCode(formInfo.inviteCode, addedUser._id);
            console.log(`New user created with ID: ${addedUser._id}`);
            this.logger.log(`New user created with ID: ${addedUser._id}`);
            return await this.login(addedUser, req, device, false);
        } else {
            console.log('Invite code is invalid');
            throw new BadRequestException(`You need a valid invite code to register!`);
        }
    }

    public async logout(req): Promise<void> {
        req._cookies = [
            {
                name: 'refreshToken',
                value: '',
                options: { httpOnly: true, expires: new Date(Date.now()) },
            },
        ];
    }

    public async refreshLogin(user: JwtPayload): Promise<string> {
        const validatedUser = await this.accountStore.fetchAccountById(user.sub);
        const newPayload = await AuthService.createPayload(validatedUser);

        return this.jwtService.sign(newPayload);
    }

    public async checkRefreshToken(accountId: string, sessionId: string): Promise<boolean> {
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');
        return await this.accountStore.checkSession(accountId, hashedSessionId);
    }

    public async clearRefreshToken(userId: string, oldSessionId: string): Promise<void> {
        const hashedSessionId = createHash('sha256').update(oldSessionId).digest('base64');
        await this.accountStore.removeSession(userId, hashedSessionId);
    }

    public async checkRoles(accountId: string, ...requiredRoles: Roles[]) {
        const roles = await this.accountStore.fetchRoles(accountId);
        const hasRoles = intersection(roles, requiredRoles);
        // if the hasRoles array has a length of 0, it means it has nothing
        // in common with the array of required roles. we want greater than 0.
        return hasRoles.length !== 0;
    }

    public async verifyPseudonym(accountId: string, pseudId: string) {
        const account = await this.accountStore.fetchAccountById(accountId);
        return account.pseudonyms.some((elem) => elem._id === pseudId);
    }

    //#endregion

    //#region ---PSEUDONYMS---

    public async createPseudonym(user: JwtPayload, formInfo: PseudonymForm): Promise<Pseudonym> {
        const thisAccount = await this.accountStore.fetchAccountById(user.sub);

        if (thisAccount === null || thisAccount === undefined) {
            throw new NotFoundException(`The account you're trying to edit could not be found.`);
        }

        const newPseud = await this.pseudStore.createPseud(user, formInfo);
        await this.accountStore.addPseudonym(thisAccount._id, newPseud._id);
        return newPseud;
    }

    //#endregion

    //#region ---PRIVATE---

    private static async createPayload(user: Account): Promise<JwtPayload> {
        return {
            roles: user.roles,
            sub: user._id,
        };
    }

    private static async buildLoginPackage(
        signedPayload: string,
        user: FrontendAccount,
    ): Promise<LoginPackage> {
        return {
            token: signedPayload,
            account: user,
        };
    }

    private async createSession(accountId: string, req, deviceInfo: DeviceInfo): Promise<Account> {
        const sessionId = nanoid();
        const expiration = new Date(Date.now() + REFRESH_EXPIRATION);
        req._cookies = [
            {
                name: 'refreshToken',
                value: sessionId,
                options: { httpOnly: true, expires: expiration },
            },
        ];
        return await this.accountStore.saveSession(accountId, sessionId, deviceInfo, expiration);
    }

    //#endregion
}
