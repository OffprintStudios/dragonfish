import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { r } from 'rethinkdb-ts';
import { generate } from 'shortid';
import { hash, argon2id } from 'argon2';
import * as sanitize from 'sanitize-html';

import * as models from './models';

@Injectable()
export class UsersService {
    async createUser(newUserInfo: models.CreateUser): Promise<models.User> {
        const existingUsername = await r.table<models.User>('users').getAll(newUserInfo.username, {type: 'username'}).run();
        const existingEmail = await r.table<models.User>('users').getAll(newUserInfo.email, {index: 'email'}).run();

        if (existingUsername.length !== 0 || existingEmail.length !== 0) {
            throw new ConflictException('Someone already has your username or email. Try another combination.');
        } else {
            const newUserId = generate();
            const newUser: models.User = {
                id: newUserId,
                email: sanitize(newUserInfo.email),
                username: sanitize(newUserInfo.username),
                password: await hash(newUserInfo.password, {type: argon2id}),
                profile: {
                    avatar: 'https://images.offprint.net/avatars/avatar.png',
                    themePref: 'crimson',
                    bio: null,
                    tagline: null,
                },
                stats: {
                    works: 0,
                    blogs: 0,
                    subscribers: 0,
                    subscriptions: 0,
                },
                audit: {
                    roles: ['user'],
                    sessions: null,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            return await r.table<models.User>('users').insert(newUser).run().then(async _stuff => {
                return await r.table<models.User>('users').get(newUserId).run();
            });
        }
    }

    async findOneByUsername(potUsername: string): Promise<models.User> {
        const user = await r.table<models.User>('users').getAll(potUsername, {index: 'username'}).run();
        if (user.length === 1) {
            return user[0];
        } else {
            throw new NotFoundException('It doesn\'t look like you exist yet. Why not make an account?');
        }
    }

    public buildFrontendUser(user: models.User, newToken?: string): models.FrontendUser {
        const frontendUser: models.FrontendUser = {
            id: user.id,
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
