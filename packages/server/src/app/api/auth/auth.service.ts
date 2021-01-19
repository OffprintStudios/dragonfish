import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';

import { User, FrontendUser, ChangePassword, ChangeProfile, ChangeEmail, ChangeUsername, UpdateTagline } from '@pulp-fiction/models/users';
import { UsersService } from '../../db/users/users.service';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { String } from 'aws-sdk/clients/appstream';

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
            sub: user._id
        };
        if (sessionId) {
            req._cookies = [
                {name: 'refreshToken', value: sessionId, options: {httpOnly: true, expires: sessionExpiry}}
            ]
        } else {
            req._cookies = [
                {name: 'refreshToken', value: '', options: {httpOnly: true, expires: Date.now()}}
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
    async refreshLogin(user: JwtPayload): Promise<string> {
        const validatedUser = await this.usersService.findOneById(user.sub);
        const newPayload: JwtPayload = {
            username: validatedUser.username,
            roles: validatedUser.audit.roles,
            sub: validatedUser._id
        };

        return this.jwtService.sign(newPayload);
    }

    /**
     * Changes a user's username. First validates their credentials, and if they match, makes the change
     * and returns a new FrontendUser.
     * @param jwtPayload The JWT payload of the user making the request.
     * @param changeUsernameRequest The requested new username, and current password.
     */
    async changeUsername(jwtPayload: JwtPayload, changeUsernameRequest: ChangeUsername): Promise<FrontendUser> {
        const potentialUser = await this.usersService.findOneById(jwtPayload.sub);
        if (!potentialUser) {
            // This happening is _super_ fishy. Either a well-meaning tinkerer playing with the API, or something malicious.
            throw new NotFoundException(`Can't seem to find you. Try again in a little bit.`)
        }
       
        if (!(await verify(potentialUser.password, changeUsernameRequest.currentPassword, {type: argon2id}))) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
        const updatedUser = await this.usersService.changeUsername(potentialUser._id, changeUsernameRequest.newUsername);
        const newJwt: JwtPayload = {
            sub: jwtPayload.sub,
            username: jwtPayload.username,
            roles: jwtPayload.roles
        }
        return this.usersService.buildFrontendUser(updatedUser, this.jwtService.sign(newJwt));        
    }

    /**
     * Change a user's email. First validates their credentials, and if they match, makes the change,
     * and returns a new FrontendUser.
     * @param jwtPayload The JWT payload of the user making the request.
     * @param changeEmailRequest The requested new email, and current password.
     */
    async changeEmail(jwtPayload: JwtPayload, changeEmailRequest: ChangeEmail): Promise<FrontendUser> {
        const potentialUser = await this.usersService.findOneById(jwtPayload.sub);
        if (!potentialUser) {
            // This happening is _super_ fishy. Either a well-meaning tinkerer playing with the API, or something malicious.
            throw new NotFoundException(`Can't seem to find you. Try again in a little bit.`)
        }
       
        if (!(await verify(potentialUser.password, changeEmailRequest.currentPassword, {type: argon2id}))) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }

        const updatedUser = await this.usersService.changeEmail(potentialUser._id, changeEmailRequest.newEmail);
        const newJwt: JwtPayload = {
            sub: jwtPayload.sub,
            username: jwtPayload.username,
            roles: jwtPayload.roles
        }
        return this.usersService.buildFrontendUser(updatedUser, this.jwtService.sign(newJwt))        
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
     * Update the given user's 'agreedToPolicies' flag to be true. Returns a new
     * FrontendUSer on success.
     * @param user The ID of the user to update.
     */
    async agreeToPolicies(user: JwtPayload): Promise<FrontendUser> {
        const updatedUserInfo = await this.usersService.agreeToPolicies(user.sub);
        const updatedJwt: JwtPayload = {
            sub: user.sub,
            username: user.username,
            roles: user.roles
        };
        return this.usersService.buildFrontendUser(updatedUserInfo, this.jwtService.sign(updatedJwt));
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

    /**
     * Updates a user's tagline with the provided info.
     * 
     * @param user The user's JWT
     * @param newTagline Their new tagline
     */
    async updateTagline(user: JwtPayload, newTagline: UpdateTagline): Promise<FrontendUser> {
        const updatedUser = await this.usersService.updateTagline(user.sub, newTagline.newTagline);
        const newUserPayload: JwtPayload = {
            sub: user.sub,
            username: user.username,
            roles: user.roles
        };

        return this.usersService.buildFrontendUser(updatedUser, this.jwtService.sign(newUserPayload));
    }
}