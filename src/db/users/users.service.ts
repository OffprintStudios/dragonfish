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

    async findOneByUsername(potUsername: string): Promise<models.User> {
        return await this.userModel.findOne({username: sanitize(potUsername)});
    }

    async fetchUserRefreshToken(userId: string, potToken: string): Promise<string> {
        const user = await this.userModel.findById(userId);

        if (isNullOrUndefined(user)) {
            throw new ForbiddenException('You do not have permission to access this resource.');
        } else {
            return user.audit.roles.find(item => { return item === potToken });
        }
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
                subscribers: user.stats.subscribers,
                subscriptions: user.stats.subscriptions,
            },
            roles: user.audit.roles,
            createdAt: user.createdAt,
            token: newToken,
        };
        return frontendUser;
    }
}
