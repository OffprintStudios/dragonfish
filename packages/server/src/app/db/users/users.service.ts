import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { hash, argon2id } from 'argon2';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import validator from 'validator';

import * as documents from './models';
import * as models from '@pulp-fiction/models/users';
import { CreateCollection } from '@pulp-fiction/models/collections';
import { SearchParameters } from '../../api/search/models/search-parameters';
import { SearchResults } from '../../api/search/models/search-results';
import { isNullOrUndefined, REFRESH_EXPIRATION } from '../../util';
import { createHash } from 'crypto';
import { CollectionsService } from '../collections/collections.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<documents.UserDocument>,
        @InjectModel('InviteCodes') private readonly inviteCodesModel: Model<documents.InviteCodesDocument>,
        private readonly collsService: CollectionsService) { }

    /**
     * Creates a user and adds them to the database. First, it ensures the 
     * invite code is valid, and hasn't been used yet. Then, it checks to see if
     * a user with the requested username and/or email already exists. If they do,
     * then the creation is rejected. Otherwise, the creation proceeds.
     * 
     * @param newUserInfo A new user's information
     */
    async createUser(newUserInfo: models.CreateUser): Promise<models.User> {
        if (!newUserInfo.agreedToPolicies) {
            throw new BadRequestException("You must agree to the site policies.");
        }

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

        const existingUsername = await this.userModel.findOne({ username: await sanitizeHtml(newUserInfo.username) });
        const existingEmail = await this.userModel.findOne({ email: await sanitizeHtml(newUserInfo.email) });
        if (!isNullOrUndefined(existingUsername) || !isNullOrUndefined(existingEmail)) {
            throw new ConflictException('Someone already has your username or email. Try another combination.');
        }

        const newUser = await new this.userModel(newUserInfo).save();              
        await this.useInviteCode(storedInviteCode._id, newUser._id);
            
        const newFavColl: CreateCollection = {
            name: 'Favorites',
            desc: `For the stories I'd rather never forget.`,
            public: false
        };
        await this.collsService.createCollection(newUser._id, newFavColl);

        return newUser;
    }

    /**
     * Finds a user by their email address.
     * 
     * @param potEmail A potential user's email
     */
    async findOneByEmail(potEmail: string): Promise<models.User> {
        return await this.userModel.findOne({ email: await sanitizeHtml(potEmail) });
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
    async addRefreshToken(userId: string, sessionId: string): Promise<models.AuditSession> {
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');
        const now = Date.now();
        const updatedValue = await this.userModel.findOneAndUpdate({ _id: userId },
            {
                $push: {
                    'audit.sessions': {
                        _id: hashedSessionId,
                        'createdAt': now,
                        'expires': now + REFRESH_EXPIRATION
                    }
                }
            }, { new: true });
        return updatedValue.audit.sessions.find(x => x._id === hashedSessionId);
    }

    /**
     * Removes the given session ID from a user's sessions array on their document.
     * @param userId A user's ID
     * @param sessionId The session ID to remove
     */
    async clearRefreshToken(userId: string, sessionId: string) {        
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');        
        return await this.userModel.updateOne({ _id: userId }, { $pull: { "audit.sessions": {_id: hashedSessionId} } });
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
            agreedToPolicies: user.agreedToPolicies,
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
     * @param sessionId The refresh token ID to check
     */
    async checkRefreshToken(userId: string, sessionId: string): Promise<boolean> {
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');  
        const validUser = await this.userModel.findOne({ _id: userId, 'audit.sessions._id': hashedSessionId });
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
     * Updates a user's username, and ensures that the new username is not already in use.
     * @param userId The user's ID.
     * @param newUsername The user's proposed new username.
     */
    async changeUsername(userId: string, newUsername: string): Promise<models.User> {
        const existingUsername = await this.userModel.findOne({username: await sanitizeHtml(newUsername)});
        if (!isNullOrUndefined(existingUsername)) {
            throw new ConflictException(`This username is already in use. Please use another.`);
        }
        return await this.userModel.findOneAndUpdate({_id: userId}, {username: newUsername}, {new: true});
    }

    /**
     * Updates a user's email, and ensures that the new email is not already in use.
     * @param userId The user's ID.
     * @param newEmail The user's proposed new email address.
     */
    async changeEmail(userId: string, newEmail: string): Promise<models.User> {
        const existingEmail = await this.userModel.findOne({email: await sanitizeHtml(newEmail)});
        if (!isNullOrUndefined(existingEmail)) {
            throw new ConflictException(`That email is already in use. Please use another.`);
        }
        return await this.userModel.findOneAndUpdate({_id: userId}, {email: newEmail}, {new: true});
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
            return await this.userModel.findOneAndUpdate({ "_id": userId }, { "password": newHashedPw }, { new: true });
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
        return await this.userModel.findOneAndUpdate({ "_id": userId }, { "profile.themePref": newProfileInfo.themePref, "profile.bio": newProfileInfo.bio }, { new: true });
    }

    /**
     * Updates a user's avatar with the new URL. Does not require a password, because
     * this information is not account sensitive.
     * @param userId The ID of the user to update.
     * @param avatarUrl The full URL of the new avatar
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<models.User> {
        return await this.userModel.findOneAndUpdate({ _id: userId }, { "profile.avatar": avatarUrl }, { new: true });
    }

    /**
     * Updates a user's 'agreedToPolicy' to be true and returns the updated user.
     * @param userId The ID of the user to update.
     */
    async agreeToPolicies(userId: string): Promise<models.User> {
        return await this.userModel.findOneAndUpdate({_id: userId}, {agreedToPolicies: true}, { new: true });
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
    async findRelatedUsers(searchParameters: SearchParameters): Promise<SearchResults<documents.SearchUserDocument> | null> {
        const p = searchParameters.pagination;
        const filter: FilterQuery<models.User> = {
            $text: { $search: searchParameters.text }
        };

        const results = await this.userModel.find(filter)
            .select({searchScore: {$meta: 'textScore'}})
            .sort({ score: { $meta: 'textScore' } })
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

    /* Invite codes, only used for the Origins Arc */

    /**
     * Return the invite code with the given ID.
     * @param codeId The ID of the invite code to look for.
     */
    async findOneInviteCode(codeId: string): Promise<models.InviteCodes> {
        return await this.inviteCodesModel.findById(await sanitizeHtml(codeId));
    }

    /**
     * Marks the code with the given ID as used, preventing it from being used by anyone else.
     * @param codeId The ID of the code to mark as used.
     */
    async useInviteCode(codeId: string, usedById: string): Promise<void> {
        await this.inviteCodesModel.findOneAndUpdate({ "_id": codeId }, { "byWho": usedById, "used": true });
    }

    /**
     * Fetches this user's roles.
     * 
     * @param userId The user we're looking up
     */
    async fetchRoles(userId: string): Promise<models.Roles[]> {
        const thisUser = await this.userModel.findById(userId);
        return thisUser.audit.roles;
    }

    /**
     * Changes a user's tagline.
     * 
     * @param userId The user we're changing
     * @param newTagline Their new tagline
     */
    async updateTagline(userId: string, newTagline: string) {
        return await this.userModel.updateOne({"_id": userId}, {"profile.tagline": newTagline});
    }

    /**
     * Gets the estimated count of users from the db.
     */
    async getUserCount(): Promise<number> {
        return await this.userModel.estimatedDocumentCount().where("audit.isDeleted", false);
    }
}
