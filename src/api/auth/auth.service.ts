import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';

import { User, FrontendUser, ChangeNameAndEmail, ChangePassword, ChangeProfile } from 'src/db/users/models';
import { UsersService } from 'src/db/users/users.service';
import { JwtPayload } from './models';
import { Request } from 'express';

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
     * @param sessionId (Optional) A new session ID. If included, will set a 'refreshToken' httpOnly cookie.
     * Otherwise, the cookie will not be set, and the user's session will only last an hour.
     */
    async login(user: User, req: any, sessionId?: string): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user._id
        };
        if (sessionId) {
            req._cookies = [
                {name: 'refreshToken', value: sessionId, options: {httpOnly: true, expires: new Date(Date.now() + 2_592_000_000)}}
            ]
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
            {name: 'refreshToken', value: "", options: {httpOnly: true, expires: new Date(Date.now())}}
        ];
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

    /**
     * Checks to see if the user making a username and email change request is actually
     * allowed by checking the password hash. If they are, then their new username and email
     * are accepted for processing. If not, then this errors out.
     * 
     * @param user The user making the request
     * @param newNameAndEmail Their new username and email
     */
    async changeNameAndEmail(user: JwtPayload, newNameAndEmail: ChangeNameAndEmail): Promise<FrontendUser> {
        const potentialUser = await this.usersService.findOneById(user.sub);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, newNameAndEmail.currentPassword, {type: argon2id})) {
                    const newUserInfo = await this.usersService.changeNameAndEmail(potentialUser._id, newNameAndEmail);
                    const newUserPayload: JwtPayload = {
                        sub: newUserInfo._id,
                        username: newUserInfo.username,
                        roles: newUserInfo.audit.roles,
                    };
                    return this.usersService.buildFrontendUser(newUserInfo, this.jwtService.sign(newUserPayload)); // Probably want to not do this for potential security concerns
                } else {
                    throw new UnauthorizedException(`You don't have permission to do that.`);
                }
            } catch (err) {
                console.log(err);
                throw new InternalServerErrorException('Something went wrong verifying your credentials. Try again in a little bit.');
            }
        } else {
            throw new NotFoundException(`It doesn't look like you exist! Try again in a little bit, or create an account.`);
        }
    }

    /**
     * Checks to see if the user making a password change request is actually
     * allowed by checking the password hash. If they are, then their new password is accepted
     * for processing. If not, then this errors out.
     * 
     * @param user The user making the request
     * @param newPassword Their new password
     */
    async changePassword(user: JwtPayload, newPassword: ChangePassword) {
        const potentialUser = await this.usersService.findOneById(user.sub);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, newPassword.currentPassword, {type: argon2id})) {
                    const newUserInfo = await this.usersService.changePassword(potentialUser._id, newPassword);
                    const newUserPayload: JwtPayload = {
                        sub: newUserInfo._id,
                        username: newUserInfo.username,
                        roles: newUserInfo.audit.roles,
                    };
                    return this.usersService.buildFrontendUser(newUserInfo, this.jwtService.sign(newUserPayload)); // Probably want to not do this for potential security concerns
                } else {
                    throw new UnauthorizedException(`You don't have permission to do that.`);
                }
            } catch (err) {
                throw new InternalServerErrorException(`Something went wrong verifying your credentials. Try again in a little bit.`);
            }
        } else {
            throw new NotFoundException(`It doesn't look like you exist! Try again in a little bit, or create an account.`);
        }
    }

    /**
     * Since profile information is not account sensitive, the new information is passed
     * directly along to the requisite usersService function. A new FrontendUser is returned.
     * 
     * This shouldn't error out.
     * 
     * @param user The user making the request
     * @param newProfileInfo Their new profile info
     */
    async updateProfile(user: JwtPayload, newProfileInfo: ChangeProfile) {
        const newUserInfo = await this.usersService.updateProfile(user.sub, newProfileInfo);
        const newUserPayload: JwtPayload = {
            sub: user.sub,
            username: user.username,
            roles: user.roles,
        };
        return this.usersService.buildFrontendUser(newUserInfo, this.jwtService.sign(newUserPayload));
    }

    /**
     * Updates the user's avatar. Not account-sensitive, so doesn't require a password.
     * A new FrontendUser is returned.
     * @param user The user making the request
     * @param newAvatarUrl Their new avatar URL
     */
    async updateAvatar(user: JwtPayload, newAvatarUrl: string): Promise<FrontendUser> {
        const updatedUser = await this.usersService.updateAvatar(user.sub, newAvatarUrl);
        const newUserPayload: JwtPayload = {
            sub: user.sub,
            username: user.username,
            roles: user.roles
        };
        return this.usersService.buildFrontendUser(updatedUser, this.jwtService.sign(newUserPayload));
    }
}