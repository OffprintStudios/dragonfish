import {
    Injectable,
    Logger,
    UnauthorizedException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { verify, argon2id } from 'argon2';

import { UsersStore } from '../../db/users/users.store';
import { JwtPayload } from '@dragonfish/models/auth';
import {
    FrontendUser,
    ChangeUsername,
    ChangeEmail,
    ChangePassword,
    ChangeProfile,
    UpdateTagline,
} from '@dragonfish/models/users';
import { IUser } from '../../shared/auth';

@Injectable()
export class UserService implements IUser {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private readonly usersService: UsersStore) {}

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
            throw new NotFoundException(`Can't seem to find you. Try again in a little bit.`);
        }

        if (!(await verify(potentialUser.password, changeUsernameRequest.currentPassword, { type: argon2id }))) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
        const updatedUser = await this.usersService.changeUsername(
            potentialUser._id,
            changeUsernameRequest.newUsername,
        );
        return this.usersService.buildFrontendUser(updatedUser);
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
            throw new NotFoundException(`Can't seem to find you. Try again in a little bit.`);
        }

        if (!(await verify(potentialUser.password, changeEmailRequest.currentPassword, { type: argon2id }))) {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }

        const updatedUser = await this.usersService.changeEmail(potentialUser._id, changeEmailRequest.newEmail);
        return this.usersService.buildFrontendUser(updatedUser);
    }

    /**
     * Checks to see if the user making a password change request is actually
     * allowed by checking the password hash. If they are, then their new password is accepted
     * for processing. If not, then this errors out.
     *
     * @param user The user making the request
     * @param newPassword Their new password
     */
    async changePassword(user: JwtPayload, newPassword: ChangePassword): Promise<FrontendUser> {
        const potentialUser = await this.usersService.findOneById(user.sub);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, newPassword.currentPassword, { type: argon2id })) {
                    const newUserInfo = await this.usersService.changePassword(potentialUser._id, newPassword);
                    return this.usersService.buildFrontendUser(newUserInfo);
                } else {
                    throw new UnauthorizedException(`You don't have permission to do that.`);
                }
            } catch (err) {
                throw new InternalServerErrorException(
                    `Something went wrong verifying your credentials. Try again in a little bit.`,
                );
            }
        } else {
            throw new NotFoundException(
                `It doesn't look like you exist! Try again in a little bit, or create an account.`,
            );
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
    async updateProfile(user: JwtPayload, newProfileInfo: ChangeProfile): Promise<FrontendUser> {
        const newUserInfo = await this.usersService.updateProfile(user.sub, newProfileInfo);
        return this.usersService.buildFrontendUser(newUserInfo);
    }

    /**
     * Update the given user's 'agreedToPolicies' flag to be true. Returns a new
     * FrontendUSer on success.
     * @param user The ID of the user to update.
     */
    async agreeToPolicies(user: JwtPayload): Promise<FrontendUser> {
        const updatedUserInfo = await this.usersService.agreeToPolicies(user.sub);
        return this.usersService.buildFrontendUser(updatedUserInfo);
    }

    /**
     * Updates the user's avatar. Not account-sensitive, so doesn't require a password.
     * A new FrontendUser is returned.
     * @param user The user making the request
     * @param newAvatarUrl Their new avatar URL
     */
    async updateAvatar(user: JwtPayload, newAvatarUrl: string): Promise<FrontendUser> {
        const updatedUser = await this.usersService.updateAvatar(user.sub, newAvatarUrl);
        return this.usersService.buildFrontendUser(updatedUser);
    }

    /**
     * Updates a user's tagline with the provided info.
     *
     * @param user The user's JWT
     * @param newTagline Their new tagline
     */
    async updateTagline(user: JwtPayload, newTagline: UpdateTagline): Promise<FrontendUser> {
        const updatedUser = await this.usersService.updateTagline(user.sub, newTagline.newTagline);
        return this.usersService.buildFrontendUser(updatedUser);
    }
}
