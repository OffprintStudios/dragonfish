import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNullOrUndefined } from 'util';
import * as sanitize from 'sanitize-html';
import validator from 'validator';

import * as models from './models';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<models.User>) {}

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

    async findOneByEmail(potEmail: string): Promise<models.User> {
        return await this.userModel.findOne({email: sanitize(potEmail)});
    }

    async addRefreshToken(userId: string, sessionId: string): Promise<void> {
        return await this.userModel.updateOne({"_id": userId}, {$push: {"audit.sessions": sessionId}});
    }
    
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

    async checkRefreshToken(userId: string, refreshToken: string) {
        const validUser = await this.userModel.findById({"_id": userId,"audit.sessions": refreshToken});
        if (validUser) {
            return true;
        } else {
            return false;
        }
    }

    /* Stat counters */
    async updateBlogCount(userId: string, blogCount: number): Promise<void> {
        await this.userModel.updateOne({"_id": userId}, {"stats.blogs": blogCount});
    }

    async updateWorkCount(userId: string, workCount: number): Promise<void> {
        await this.userModel.updateOne({"_id": userId}, {"stats.works": workCount});
    }
}
