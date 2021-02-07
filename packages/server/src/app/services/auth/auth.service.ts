import {
    Injectable,
    Logger,
    UnauthorizedException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';
import { nanoid } from 'nanoid';

import { User, FrontendUser, CreateUser, AuditSession } from '@dragonfish/models/users';
import { UsersService } from '../../db/users/users.service';
import { JwtPayload } from '@dragonfish/models/auth';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    /**
     * Validates the incoming email and password of a login request. Returns a User
     * if validation success, but otherwise errors out.
     *
     * @param email A potential user's email
     * @param password A potential user's password
     */
    async validateUser(email: string, password: string): Promise<User> {
        const potentialUser = await this.usersService.findOneByEmail(email);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, password, { type: argon2id })) {
                    return potentialUser;
                } else {
                    throw new UnauthorizedException('Either your email or password is invalid.');
                }
            } catch (err) {
                throw new InternalServerErrorException(
                    'Something went wrong logging you in. Try again in a little bit.',
                );
            }
        } else {
            throw new NotFoundException("Looks like you don't exist yet. Why not try signing up?");
        }
    }

    /**
     * Registers a new user, then logs them in.
     *
     * @param req The request object
     * @param newUser The new user's credentials
     * @returns
     */
    async register(req: any, newUser: CreateUser): Promise<FrontendUser> {
        const addedUser = await this.usersService.createUser(newUser);
        this.logger.log(`New user created with ID: ${addedUser._id}`);
        const sessionId = nanoid();
        const newSession = await this.usersService.addRefreshToken(addedUser._id, sessionId);
        return this.login(addedUser, req, sessionId, newSession.expires);
    }

    /**
     * Logs a user in by generating a JWT payload and (if requested) setting the httpOnly refresh token
     * in the request cookies header. Then, constructs a specialized FrontendUser object
     * to send to the frontend.
     *
     * @param user The incoming user
     * @param req The incoming login request
     * @param sessionId (Optional) A new session ID. If included, sessionExpiry must also be included.
     * If included, will set a 'refreshToken' httpOnly cookie.
     * Otherwise, the cookie will not be set, and the user's session will only last an hour.
     * @param sessionExpiry (Optional) Must be included if sessionId is passed. The expiry date of the user's session.
     */
    async login(user: User, req: any, sessionId?: string, sessionExpiry?: Date): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user._id,
        };
        if (sessionId) {
            req._cookies = [
                { name: 'refreshToken', value: sessionId, options: { httpOnly: true, expires: sessionExpiry } },
            ];
        } else {
            req._cookies = [{ name: 'refreshToken', value: '', options: { httpOnly: true, expires: Date.now() } }];
        }
        return this.usersService.buildFrontendUser(user, this.jwtService.sign(payload));
    }

    /**
     * Logs a user out by deleting their HTTP-only refresh token cookie. The rest of the logout process
     * takes place in the user service, or client-side.
     * @param req The incoming logout request
     */
    logout(req: any) {
        req._cookies = [
            { name: 'refreshToken', value: '', options: { httpOnly: true, expires: new Date(Date.now()) } },
        ];
    }

    /**
     * Refreshes the login of a given user by generating a new JWT payload and reconstructing
     * the FrontendUser object of the requisite user.
     *
     * @param user A user's JWT payload
     */
    async refreshLogin(user: JwtPayload): Promise<string> {
        const validatedUser = await this.usersService.findOneById(user.sub);
        const newPayload: JwtPayload = {
            username: validatedUser.username,
            roles: validatedUser.audit.roles,
            sub: validatedUser._id,
        };

        return this.jwtService.sign(newPayload);
    }

    /**
     * Adds a Session ID from a new refresh token to a user's active sessions.
     *
     * @param userId The user's ID
     * @param sessionId The new session ID to add
     * @returns
     */
    async addRefreshToken(userId: string, sessionId: string): Promise<AuditSession> {
        return await this.usersService.addRefreshToken(userId, sessionId);
    }

    /**
     * Checks to see if the refresh token with the provided session ID is valid.
     *
     * @param userId The user's ID
     * @param sessionId The session to check
     * @returns
     */
    async checkRefreshToken(userId: string, sessionId: string): Promise<boolean> {
        return await this.usersService.checkRefreshToken(userId, sessionId);
    }

    /**
     * Clears the specified session ID from a user's session list.
     *
     * @param userId The user's ID
     * @param oldSessionId Their old session ID
     * @returns
     */
    async clearRefreshToken(userId: string, oldSessionId: string): Promise<void> {
        return await this.usersService.clearRefreshToken(userId, oldSessionId);
    }
}
