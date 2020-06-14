  
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';

import { User, FrontendUser } from 'src/db/users/models';
import { UsersService } from 'src/db/users/users.service';
import { JwtPayload } from './models';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<User> {
        const potentialUser = await this.usersService.findOneByUsername(username);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, password, {type: argon2id})) {
                    return potentialUser;
                } else {
                    throw new UnauthorizedException('Either your username or password is invalid.');
                }
            } catch (err) {
                throw new InternalServerErrorException('Something went wrong trying to validate your credentials. Try again in a little bit.');
            }
        }
    }

    async login(user: User): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user._id
        };
        return this.usersService.buildFrontendUser(user, this.jwtService.sign(payload));
    }

    async getNewToken(user: User): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user.id
        };
        return this.usersService.buildFrontendUser(user, this.jwtService.sign(payload));
    }
}