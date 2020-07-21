import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNullOrUndefined } from 'util';
import * as sanitize from 'sanitize-html';
import validator from 'validator';

import * as models from './models';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<models.User>, @InjectModel('InviteCodes') private readonly inviteCodesModel: Model<models.InviteCodes>) {}

    /**
     * Creates a user and adds them to the database. First, it checks to see if
     * a user with the requested username and/or email already exist. If true,
     * then the creation is rejected. Otherwise, the creation proceeds.
     * 
     * @param newUserInfo A new user's information
     */
    async createUser(newUserInfo: models.CreateUser): Promise<models.User> {
        if (validator.isEmail(newUserInfo.email)) {
            const existingUsername = await this.userModel.findOne({username: sanitize(newUserInfo.username)});
            const existingEmail = await this.userModel.findOne({email: sanitize(newUserInfo.email)});

            if (isNullOrUndefined(existingUsername) && isNullOrUndefined(existingEmail)) {
                const newUser = new this.userModel(newUserInfo);
                return await newUser.save();         
            } else {
                throw new ConflictException('Someone already has your username or email. Try another combination.');
            }
        } else {
            throw new BadRequestException('That is not a valid email address.');
        }
    }

    /**
     * Finds a user by their email address.
     * 
     * @param potEmail A potential user's email
     */
    async findOneByEmail(potEmail: string): Promise<models.User> {
        return await this.userModel.findOne({email: sanitize(potEmail)});
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
        return await this.userModel.updateOne({"_id": userId}, {$push: {"audit.sessions": sessionId}});
    }
    
    /**
     * Builds a new FrontendUser object, including any available JSON web token.
     * 
     * @param user A user
     * @param newToken A new JSON web token
     */
    public buildFrontendUser(user: models.User, newToken?: string): models.FrontendUser {
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
        const validUser = await this.userModel.findById({"_id": userId,"audit.sessions": refreshToken});
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
        await this.userModel.updateOne({"_id": userId}, {"stats.blogs": blogCount});
    }

    /**
     * Updates the number of works a user has tied to their account. Should only
     * count works that are published and not deleted.
     * 
     * @param userId A user's ID
     * @param workCount The number of works tied to that user
     */
    async updateWorkCount(userId: string, workCount: number): Promise<void> {
        await this.userModel.updateOne({"_id": userId}, {"stats.works": workCount});
    }

    /* Invite codes, only used for Origins, pt. 1 */
    // TODO: Write those damn invite code functions
}
