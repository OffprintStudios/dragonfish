import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { hash, argon2id } from 'argon2';
import * as sanitize from 'sanitize-html';
import validator from 'validator';

import * as models from './models';
import { isNullOrUndefined } from '../../util/validation';
import { SearchParameters } from '../../api/search/models/search-parameters';
import { SearchResults } from '../../api/search/models/search-results';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<models.User>,
        @InjectModel('InviteCodes') private readonly inviteCodesModel: Model<models.InviteCodes>) { }

    /**
     * Creates a user and adds them to the database. First, it ensures the 
     * invite code is valid, and hasn't been used yet. Then, it checks to see if
     * a user with the requested username and/or email already exists. If they do,
     * then the creation is rejected. Otherwise, the creation proceeds.
     * 
     * @param newUserInfo A new user's information
     */
    async createUser(newUserInfo: models.CreateUser): Promise<models.User> {
        if (!newUserInfo.inviteCode) {
            throw new BadRequestException('An invite code is required while Offprint is in its Origins phase.')
        }

        const storedInviteCode = await this.findOneInviteCode(newUserInfo.inviteCode);
        if (storedInviteCode === null || storedInviteCode === undefined) {
            throw new BadRequestException('That is not a valid invite code.');
        }

        if (storedInviteCode.used) {
            throw new BadRequestException('This invite code has already been used.');
        }

        if (!validator.isEmail(newUserInfo.email)) {
            throw new BadRequestException('That is not a valid email address.');
        }

        if (newUserInfo.username.length < 3 || newUserInfo.username.length > 50) {
            throw new BadRequestException('Your username must be between 3 and 50 characters.');
        }

        const existingUsername = await this.userModel.findOne({ username: sanitize(newUserInfo.username) });
        const existingEmail = await this.userModel.findOne({ email: sanitize(newUserInfo.email) });
        if (!isNullOrUndefined(existingUsername) || !isNullOrUndefined(existingEmail)) {
            throw new ConflictException('Someone already has your username or email. Try another combination.');
        }

        const newUser = new this.userModel(newUserInfo);

        const savedUser = await newUser.save();
        await this.useInviteCode(storedInviteCode._id, savedUser._id);

        return savedUser;
    }

    /**
     * Finds a user by their email address.
     * 
     * @param potEmail A potential user's email
     */
    async findOneByEmail(potEmail: string): Promise<models.User> {
        return await this.userModel.findOne({ email: sanitize(potEmail) });
    }

    /**
     * Finds a user by their ID.
     * 
     * @param userId A user's ID
     */
    async findOneById(userId: string): Promise<models.User> {
        return await this.userModel.findById(userId);
    }

    /**
     * Adds a new refresh session ID to the user's sessions array on their document.
     * 
     * @param userId A user's ID
     * @param sessionId A user's session ID
     */
    async addRefreshToken(userId: string, sessionId: string): Promise<void> {
        return await this.userModel.updateOne({ "_id": userId }, { $push: { "audit.sessions": sessionId } });
    }

    /**
     * Removes the given session ID from a user's sessions array on their document.
     * @param userId A user's ID
     * @param sessionId The session ID to remove
     */
    async clearRefreshToken(userId: string, sessionId: string) {
        return await this.userModel.updateOne({ "_id": userId }, { $pull: { "audit.sessions": sessionId } });
    }

    /**
     * Builds a new FrontendUser object, including any available JSON web token.
     * 
     * @param user A user
     * @param newToken A new JSON web token
     */
    async buildFrontendUser(user: models.User, newToken?: string): Promise<models.FrontendUser> {
        const frontendUser: models.FrontendUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            profile: {
                avatar: user.profile.avatar,
                themePref: user.profile.themePref,
                bio: user.profile.bio,
                tagline: user.profile.tagline,
            },
            stats: {
                works: user.stats.works,
                blogs: user.stats.blogs,
                watchers: user.stats.watchers,
                watching: user.stats.watching,
            },
            roles: user.audit.roles,
            createdAt: user.createdAt,
            token: newToken,
        };
        return frontendUser;
    }

    /**
     * Determins if the supposed refresh token matches a valid session ID
     * in the user's document. If yes, then it returns true. Otherwise,
     * returns false.
     * 
     * @param userId A user's ID
     * @param refreshToken An available refresh token
     */
    async checkRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const validUser = await this.userModel.findById({ "_id": userId, "audit.sessions": refreshToken });
        if (validUser) {
            return true;
        } else {
            return false;
        }
    }

    /* Stat counters */

    /**
     * Updates the number of blogs a user has tied to their account. Should only
     * count blogs that are published and not deleted.
     * 
     * @param userId A user's ID
     * @param blogCount The number of blogs tied to that user
     */
    async updateBlogCount(userId: string, blogCount: number): Promise<void> {
        await this.userModel.updateOne({ "_id": userId }, { "stats.blogs": blogCount });
    }

    /**
     * Updates the number of works a user has tied to their account. Should only
     * count works that are published and not deleted.
     * 
     * @param userId A user's ID
     * @param workCount The number of works tied to that user
     */
    async updateWorkCount(userId: string, workCount: number): Promise<void> {
        await this.userModel.updateOne({ "_id": userId }, { "stats.works": workCount });
    }

    /**
     * Updates a user's username and email, first by making sure the new username and email aren't
     * already taken. To be used only after the current password has been verified in the AuthService.
     * 
     * @param userId A user's ID
     * @param newNameAndEmail Their new name and email address
     */
    async changeNameAndEmail(userId: string, newNameAndEmail: models.ChangeNameAndEmail): Promise<models.User> {
        const existingUsername = await this.userModel.findOne({ username: sanitize(newNameAndEmail.username) });
        const existingEmail = await this.userModel.findOne({ email: sanitize(newNameAndEmail.email) });

        if (isNullOrUndefined(existingUsername) || isNullOrUndefined(existingEmail)) {
            return await this.userModel.findOneAndUpdate({ "_id": userId }, { "email": newNameAndEmail.email, "username": newNameAndEmail.username });
        } else {
            throw new ConflictException('Someone already has your username or email. Try another combination.');
        }
    }

    /**
     * Updates a user's password with a hash of their new password. To be used only after
     * the current password has been verified in the AuthService.
     * 
     * @param userId A user's ID
     * @param newPasswordInfo Their new password
     */
    async changePassword(userId: string, newPasswordInfo: models.ChangePassword): Promise<models.User> {
        try {
            const newHashedPw = await hash(newPasswordInfo.newPassword, { type: argon2id });
            return await this.userModel.findOneAndUpdate({ "_id": userId }, { "password": newHashedPw });
        } catch (err) {
            console.log(err); // we definitely want better error reporting for stuff like this
            throw new InternalServerErrorException(`Something went wrong! Try again in a little bit.`);
        }
    }

    /**
     * Updates a user's profile with their requested information. Does not require a password
     * because this information is not account sensitive.
     * 
     * @param userId A user's ID
     * @param newProfileInfo Their new profile info
     */
    async updateProfile(userId: string, newProfileInfo: models.ChangeProfile): Promise<models.User> {
        return await this.userModel.findOneAndUpdate({ "_id": userId }, { "profile.themePref": newProfileInfo.themePref, "profile.bio": newProfileInfo.bio });
    }

    /**
     * Fetches a user from the database and returns the FrontendUser object using their
     * data.
     * 
     * @param userId The user ID for the lookup
     */
    async getOneUser(userId: string): Promise<models.FrontendUser> {
        const user = await this.userModel.findById(userId);
        return await this.buildFrontendUser(user);
    }

    /**
     * Finds any related users given the provided search parameters.
     * 
     * @param searchParameters The relevant search parameters
     */
    async findRelatedUsers(searchParameters: SearchParameters): Promise<SearchResults<models.SearchUser> | null> {
        const p = searchParameters.pagination;
        const filter: FilterQuery<models.User> = {
            $text: { $search: searchParameters.text }
        };

        const results = await this.userModel.find(filter,
            {
                searchScore: { $meta: 'textScore' }
            }).sort({ score: { $meta: 'textScore' } })
            .sort({ 'stats.views': -1 })
            .select('username profile.avatar stats.works stats.blogs stats.watchers stats.watching')
            .skip((p.page - 1) * p.pageSize)
            .limit(p.pageSize);

        if (results.length === 0 && p.page !== 1) {
            return null;
        } else {
            const totalPages = Math.ceil(
                await this.userModel.count(filter) / p.pageSize // God, we should probably cache this stuff.
            );
            return {
                matches: results,
                totalPages: totalPages,
                pagination: searchParameters.pagination
            };
        }
    }

    /* Invite codes, only used for Origins, pt. 1 */

    /**
     * Return the invite code with the given ID.
     * @param codeId The ID of the invite code to look for.
     */
    async findOneInviteCode(codeId: string): Promise<models.InviteCodes> {
        return await this.inviteCodesModel.findById(sanitize(codeId));
    }

    /**
     * Marks the code with the given ID as used, preventing it from being used by anyone else.
     * @param codeId The ID of the code to mark as used.
     */
    async useInviteCode(codeId: string, usedById: string): Promise<void> {
        await this.inviteCodesModel.findOneAndUpdate({ "_id": codeId }, { "byWho": usedById, "used": true });
    }
}
