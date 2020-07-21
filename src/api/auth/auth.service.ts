import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';

import { User, FrontendUser } from 'src/db/users/models';
import { UsersService } from 'src/db/users/users.service';
import { JwtPayload } from './models';

@Injectable()
export class AuthService {
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
                if (await verify(potentialUser.password, password, {type: argon2id})) {
                    return potentialUser;
                } else {
                    throw new UnauthorizedException('Either your email or password is invalid.');
                }
            } catch (err) {
                throw new InternalServerErrorException('Something went wrong logging you in. Try again in a little bit.');
            }
        } else {
            throw new NotFoundException('Looks like you don\'t exist yet. Why not try signing up?');
        }
    }

    /**
     * Logs a user in by generating a JWT payload and setting the httpOnly refresh token
     * in the request cookies header. Then, constructs a specialized FrontendUser object
     * to send to the frontend.
     * 
     * @param user The incoming user
     * @param req The incoming login request
     * @param sessionId A new session ID
     */
    async login(user: User, req: any, sessionId: string): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user._id
        };
        req._cookies = [
            {name: 'refreshToken', value: sessionId, options: {httpOnly: true, expires: new Date(Date.now() + 2_592_000_000)}}
        ]
        return this.usersService.buildFrontendUser(user, this.jwtService.sign(payload));
    }

    /**
     * Refreshes the login of a given user by generating a new JWT payload and reconstructing
     * the FrontendUser object of the requisite user.
     * 
     * @param user A user's JWT payload
     */
    async refreshLogin(user: JwtPayload): Promise<FrontendUser> {
        const validatedUser = await this.usersService.findOneById(user.sub);
        const newPayload: JwtPayload = {
            username: validatedUser.username,
            roles: validatedUser.audit.roles,
            sub: validatedUser._id
        };
        return this.usersService.buildFrontendUser(validatedUser, this.jwtService.sign(newPayload));
    }
}