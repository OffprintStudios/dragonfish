import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { argon2id, verify } from 'argon2';
import { nanoid } from 'nanoid';
import { JwtPayload, LoginPackage } from '@dragonfish/shared/models/auth';
import { AccountsStore } from '@dragonfish/api/database/accounts/stores';
import { Account, AccountForm, FrontendAccount } from '@dragonfish/shared/models/accounts';
import { DeviceInfo } from '@dragonfish/api/utilities/models';
import { REFRESH_EXPIRATION } from '@dragonfish/api/utilities/secrets';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(private readonly accountStore: AccountsStore, private readonly jwtService: JwtService) {}

    public async validateAccount(email: string, password: string): Promise<Account> {
        const potentialAccount = await this.accountStore.fetchAccountByEmail(email);
        if (potentialAccount) {
            try {
                if (await verify(potentialAccount.password, password, { type: argon2id })) {
                    return potentialAccount;
                } else {
                    this.logger.warn(`Someone attempted to log into Account ${potentialAccount._id} and failed!`);
                }
            } catch (err) {
                throw new InternalServerErrorException(`Something went wrong! Code: sunfish`);
            }
        } else {
            throw new NotFoundException(`Looks like you don't exist yet. Why not try signing up?`);
        }
    }

    public async login(user: Account, req, device: DeviceInfo, rememberMe: boolean): Promise<LoginPackage> {
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
        const addedUser = await this.accountStore.createAccount(formInfo);
        this.logger.log(`New user created with ID: ${addedUser._id}`);
        return await this.login(addedUser, req, device, false);
    }

    public async logout(req): Promise<void> {
        req._cookies = [
            { name: 'refreshToken', value: '', options: { httpOnly: true, expires: new Date(Date.now()) } },
        ];
    }

    public async refreshLogin(user: JwtPayload): Promise<string> {
        const validatedUser = await this.accountStore.fetchAccountById(user.sub);
        const newPayload = await AuthService.createPayload(validatedUser);

        return this.jwtService.sign(newPayload);
    }

    public async checkRefreshToken(accountId: string, sessionId: string): Promise<boolean> {
        return await this.accountStore.checkSession(accountId, sessionId);
    }

    public async clearRefreshToken(userId: string, oldSessionId: string): Promise<void> {
        await this.accountStore.removeSession(userId, oldSessionId);
    }

    //#region ---PRIVATE---

    private static async createPayload(user: Account): Promise<JwtPayload> {
        return {
            roles: user.roles,
            sub: user._id,
        };
    }

    private static async buildLoginPackage(signedPayload: string, user: FrontendAccount): Promise<LoginPackage> {
        return {
            token: signedPayload,
            account: user,
        };
    }

    private async createSession(accountId: string, req, deviceInfo: DeviceInfo): Promise<Account> {
        const sessionId = nanoid();
        const expiration = new Date(Date.now() + REFRESH_EXPIRATION);
        req._cookies = [{ name: 'refreshToken', value: sessionId, options: { httpOnly: true, expires: expiration } }];
        return await this.accountStore.saveSession(accountId, sessionId, deviceInfo, expiration);
    }

    //#endregion
}
