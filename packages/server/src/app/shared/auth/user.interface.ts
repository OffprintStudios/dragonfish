import { JwtPayload } from '@dragonfish/models/auth';
import {
    FrontendUser,
    ChangeUsername,
    ChangeEmail,
    ChangePassword,
    ChangeProfile,
    UpdateTagline,
} from '@dragonfish/models/users';

export interface IUser {
    /**
     * Fetches a user from the database and returns the FrontendUser object using their data.
     * 
     * @param userId 
     */
    getOneUser(userId: string): Promise<FrontendUser>;

    /**
     * Changes a user's username. First validates their credentials, and if they match, makes the change
     * and returns a new FrontendUser.
     *
     * @param jwtPayload The JWT payload of the user making the request.
     * @param changeUsernameRequest The requested new username, and current password.
     */
    changeUsername(jwtPayload: JwtPayload, changeUsernameRequest: ChangeUsername): Promise<FrontendUser>;

    /**
     * Change a user's email. First validates their credentials, and if they match, makes the change,
     * and returns a new FrontendUser.
     * @param jwtPayload The JWT payload of the user making the request.
     * @param changeEmailRequest The requested new email, and current password.
     */
    changeEmail(jwtPayload: JwtPayload, changeEmailRequest: ChangeEmail): Promise<FrontendUser>;

    /**
     * Checks to see if the user making a password change request is actually
     * allowed by checking the password hash. If they are, then their new password is accepted
     * for processing. If not, then this errors out.
     *
     * @param user The user making the request
     * @param newPassword Their new password
     */
    changePassword(user: JwtPayload, newPassword: ChangePassword): Promise<FrontendUser>;

    /**
     * Since profile information is not account sensitive, the new information is passed
     * directly along to the requisite usersService function. A new FrontendUser is returned.
     *
     * This shouldn't error out.
     *
     * @param user The user making the request
     * @param newProfileInfo Their new profile info
     */
    updateProfile(user: JwtPayload, newProfileInfo: ChangeProfile): Promise<FrontendUser>;

    /**
     * Update the given user's 'agreedToPolicies' flag to be true. Returns a new
     * FrontendUSer on success.
     *
     * @param user The ID of the user to update.
     */
    agreeToPolicies(user: JwtPayload): Promise<FrontendUser>;

    /**
     * Updates the user's avatar. Not account-sensitive, so doesn't require a password.
     * A new FrontendUser is returned.
     *
     * @param user The user making the request
     * @param newAvatarUrl Their new avatar URL
     */
    updateAvatar(user: JwtPayload, newAvatarUrl: string): Promise<FrontendUser>;

    /**
     * Updates a user's tagline with the provided info.
     *
     * @param user The user's JWT
     * @param newTagline Their new tagline
     */
    updateTagline(user: JwtPayload, newTagline: UpdateTagline): Promise<FrontendUser>;
}
