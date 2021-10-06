import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { argon2id, hash } from 'argon2';
import * as sanitizeHtml from 'sanitize-html';
import * as validator from 'validator';
import { nanoid } from 'nanoid';
import * as models from '@dragonfish/shared/models/users';
import { CollectionForm } from '@dragonfish/shared/models/collections';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { REFRESH_EXPIRATION } from '@dragonfish/api/utilities/secrets';
import { createHash } from 'crypto';
import { CollectionsStore } from '../collections/collections.store';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { UserDocument } from './users.schema';
import { InviteCodesDocument } from './invite-codes.schema';

/** 
 * @deprecated No longer used
 */
@Injectable()
export class UsersStore {
    constructor(
        @InjectModel('User') private readonly userModel: PaginateModel<UserDocument>,
        @InjectModel('InviteCodes') private readonly inviteCodesModel: PaginateModel<InviteCodesDocument>,
        private readonly collsService: CollectionsStore,
    ) {}

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
            throw new BadRequestException('You must agree to the site policies.');
        }

        if (!newUserInfo.inviteCode) {
            throw new BadRequestException('An invite code is required while Offprint is in its Origins phase.');
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

        const existingUsername = await this.userModel.findOne({ username: sanitizeHtml(newUserInfo.username) });
        const existingEmail = await this.userModel.findOne({ email: sanitizeHtml(newUserInfo.email) });
        if (!isNullOrUndefined(existingUsername) || !isNullOrUndefined(existingEmail)) {
            throw new ConflictException('Someone already has your username or email. Try another combination.');
        }

        const newUser = await new this.userModel({
            email: newUserInfo.email,
            username: newUserInfo.username,
            password: newUserInfo.password,
            'audit.termsAgree': newUserInfo.agreedToPolicies,
        }).save();
        await this.useInviteCode(storedInviteCode._id, newUser._id);

        const newFavColl: CollectionForm = {
            name: 'Favorites',
            desc: `For the stories I'd rather never forget.`,
            public: false,
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
        return this.userModel.findOne({ email: await sanitizeHtml(potEmail) });
    }

    /**
     * Finds a user by their ID.
     *
     * @param userId A user's ID
     */
    async findOneById(userId: string): Promise<models.User> {
        return this.userModel.findById(userId);
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
        const updatedValue = await this.userModel.findOneAndUpdate(
            { _id: userId },
            {
                $push: {
                    'audit.sessions': {
                        _id: hashedSessionId,
                        createdAt: now,
                        expires: now + REFRESH_EXPIRATION,
                    },
                },
            },
            { new: true },
        );
        return updatedValue.audit.sessions.find((x) => x._id === hashedSessionId);
    }

    /**
     * Removes the given session ID from a user's sessions array on their document.
     * @param userId A user's ID
     * @param sessionId The session ID to remove
     */
    async clearRefreshToken(userId: string, sessionId: string) {
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');
        return this.userModel.updateOne({ _id: userId }, { $pull: { 'audit.sessions': { _id: hashedSessionId } } });
    }

    /**
     * Builds a new FrontendUser object, including any available JSON web token.
     *
     * @param user A user
     * @param newToken A new JSON web token
     */
    async buildFrontendUser(user: models.User, newToken?: string): Promise<models.FrontendUser> {
        return {
            _id: user._id,
            username: user.username,
            profile: {
                avatar: user.profile.avatar,
                bio: user.profile.bio,
                tagline: user.profile.tagline,
                coverPic: user.profile.coverPic,
            },
            stats: {
                works: user.stats.works,
                blogs: user.stats.blogs,
                watchers: user.stats.watchers,
                watching: user.stats.watching,
            },
            audit: {
                roles: user.audit.roles,
            },
            createdAt: user.createdAt,
            token: newToken,
        };
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
        return !!validUser;
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
        await this.userModel.updateOne({ _id: userId }, { 'stats.blogs': blogCount });
    }

    /**
     * Increments a user's blog count if the addOne flag is true. Decrements the same count if false.
     *
     * @param user The user to update
     * @param addOne Whether to add one or subtract one
     */
    async changeBlogCount(user: JwtPayload, addOne: boolean): Promise<void> {
        if (addOne === true) {
            await this.userModel.updateOne({ _id: user.sub }, { $inc: { 'stats.blogs': 1 } });
        } else {
            await this.userModel.updateOne({ _id: user.sub }, { $inc: { 'stats.blogs': -1 } });
        }
    }

    /**
     * Updates the number of works a user has tied to their account. Should only
     * count works that are published and not deleted.
     *
     * @param userId A user's ID
     * @param workCount The number of works tied to that user
     */
    async updateWorkCount(userId: string, workCount: number): Promise<void> {
        await this.userModel.updateOne({ _id: userId }, { 'stats.works': workCount });
    }

    /**
     * Increments a user's work count if the addOne flag is true. Decrements the same count if false.
     *
     * @param user The user to update
     * @param addOne Whether to add one or subtract one
     */
    async changeWorkCount(user: string, addOne: boolean): Promise<void> {
        if (addOne === true) {
            await this.userModel.updateOne({ _id: user }, { $inc: { 'stats.works': 1 } });
        } else {
            await this.userModel.updateOne({ _id: user }, { $inc: { 'stats.works': -1 } });
        }
    }

    /**
     * Updates a user's username, and ensures that the new username is not already in use.
     * @param userId The user's ID.
     * @param newUsername The user's proposed new username.
     */
    async changeUsername(userId: string, newUsername: string): Promise<models.User> {
        const existingUsername = await this.userModel.findOne({ username: sanitizeHtml(newUsername) });
        if (!isNullOrUndefined(existingUsername)) {
            throw new ConflictException(`This username is already in use. Please use another.`);
        }
        return this.userModel.findOneAndUpdate({ _id: userId }, { username: newUsername }, { new: true });
    }

    /**
     * Updates a user's email, and ensures that the new email is not already in use.
     * @param userId The user's ID.
     * @param newEmail The user's proposed new email address.
     */
    async changeEmail(userId: string, newEmail: string): Promise<models.User> {
        const existingEmail = await this.userModel.findOne({ email: sanitizeHtml(newEmail) });
        if (!isNullOrUndefined(existingEmail)) {
            throw new ConflictException(`That email is already in use. Please use another.`);
        }
        return this.userModel.findOneAndUpdate({ _id: userId }, { email: newEmail }, { new: true });
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
            return await this.userModel.findOneAndUpdate({ _id: userId }, { password: newHashedPw }, { new: true });
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
     * @param newBioInfo Their new profile info
     */
    async updateBio(userId: string, newBioInfo: models.ChangeBio): Promise<models.User> {
        return this.userModel.findOneAndUpdate({ _id: userId }, { 'profile.bio': newBioInfo.bio }, { new: true });
    }

    /**
     * Updates a user's avatar with the new URL. Does not require a password, because
     * this information is not account sensitive.
     * @param userId The ID of the user to update.
     * @param avatarUrl The full URL of the new avatar
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<models.User> {
        return this.userModel.findOneAndUpdate({ _id: userId }, { 'profile.avatar': avatarUrl }, { new: true });
    }

    /**
     * Updates a user's cover pic with the new URL. Does not require a password, because
     * this information is not account sensitive.
     * @param userId The ID of the user to update
     * @param coverPicUrl The full URL of the new cover pic
     * @returns
     */
    async updateCoverPic(userId: string, coverPicUrl: string): Promise<models.User> {
        return this.userModel.findOneAndUpdate({ _id: userId }, { 'profile.coverPic': coverPicUrl }, { new: true });
    }

    /**
     * Updates a user's 'agreedToPolicy' to be true and returns the updated user.
     * @param userId The ID of the user to update.
     */
    async agreeToPolicies(userId: string): Promise<models.User> {
        return this.userModel.findOneAndUpdate({ _id: userId }, { 'audit.termsAgree': true }, { new: true });
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
     * @param query The relevant search parameters
     * @param pageNum The page of results to retrieve
     * @param maxPerPage The maximum number of results per page
     */
    async findRelatedUsers(query: string, pageNum: number, maxPerPage: number): Promise<PaginateResult<UserDocument>> {
        return await this.userModel.paginate(
            { $text: { $search: '"' + query + '"' } },
            {
                select: '-password -agreedToPolicies -audit.sessions -audit.termsAgree -audit.emailConfirmed -audit.deleted -audit.isDeleted',
                page: pageNum,
                limit: maxPerPage,
            },
        );
    }

    /* Invite codes, only used for the Origins Arc */

    /**
     * Return the invite code with the given ID.
     * @param codeId The ID of the invite code to look for.
     */
    async findOneInviteCode(codeId: string): Promise<models.InviteCodes> {
        return this.inviteCodesModel.findById(await sanitizeHtml(codeId));
    }

    /**
     * Marks the code with the given ID as used, preventing it from being used by anyone else.
     * @param codeId The ID of the code to mark as used.
     * @param usedById Which user used this code
     */
    async useInviteCode(codeId: string, usedById: string): Promise<void> {
        await this.inviteCodesModel.findOneAndUpdate({ _id: codeId }, { byWho: usedById, used: true });
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
    async updateTagline(userId: string, newTagline: string): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { 'profile.tagline': await sanitizeHtml(newTagline) },
            { new: true },
        );
    }

    /**
     * Gets the estimated count of users from the db.
     */
    async getUserCount(): Promise<number> {
        return this.userModel.estimatedDocumentCount().where('audit.isDeleted', false);
    }

    /**
     * Fetches the list of site staff.
     */
    async getSiteStaff(): Promise<models.FrontendUser[]> {
        const userList = await this.userModel.find({
            'audit.isDeleted': false,
            $or: [
                { 'audit.roles': 'Admin' },
                { 'audit.roles': 'Moderator' },
                { 'audit.roles': 'WorkApprover' },
                { 'audit.roles': 'ChatModerator' },
            ],
        });

        const frontendUserList = Array<models.FrontendUser>();
        userList.forEach(async (user) => {
            frontendUserList.push(await this.buildFrontendUser(user));
        });

        return frontendUserList;
    }

    /**
     * Fetches the list of contributors and patreon supporters.
     */
    async getSupporters(): Promise<models.FrontendUser[]> {
        const userList = await this.userModel.find({
            'audit.isDeleted': false,
            $or: [
                { 'audit.roles': 'Maintainer' },
                { 'audit.roles': 'Contributor' },
                { 'audit.roles': 'VIP' },
                { 'audit.roles': 'Supporter' },
            ],
        });

        const frontendUserList = Array<models.FrontendUser>();
        userList.forEach(async (user) => {
            frontendUserList.push(await this.buildFrontendUser(user));
        });

        return frontendUserList;
    }

    /**
     * Generates a new invite code.
     *
     * @returns The new invite code
     */
    async generateInviteCode(): Promise<InviteCodesDocument> {
        const newCode = new this.inviteCodesModel({
            _id: nanoid(),
            used: false,
            byWho: null,
        });

        return await newCode.save();
    }
}
