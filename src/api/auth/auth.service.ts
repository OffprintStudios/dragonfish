import { Injectable, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, argon2id } from 'argon2';

import { User, FrontendUser } from 'src/mongo/users/models';
import { UsersService } from 'src/mongo/users/users.service';
import { JwtPayload } from './models';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User> {
        const potentialUser = await this.usersService.findOneByEmail(email);
        if (potentialUser) {
            try {
                if (await verify(potentialUser.password, password, {type: argon2id})) {
                    return potentialUser;
                } else {
                    throw new UnauthorizedException('Either your email or password is invalid.');
                }
            } catch (err) {
                throw new InternalServerErrorException('Something went wrong logging you in. Try again in a little bit.');
            }
        } else {
            throw new NotFoundException('Looks like you don\'t exist yet. Why not try signing up?');
        }
    }

    async login(user: User, req: any, sessionId: string): Promise<FrontendUser> {
        const payload: JwtPayload = {
            username: user.username,
            roles: user.audit.roles,
            sub: user._id
        };
        req._cookies = [
            {name: 'refreshToken', value: sessionId, options: {httpOnly: true, expires: new Date(Date.now() + 2_592_000_000)}}
        ]
        return this.usersService.buildFrontendUser(user, this.jwtService.sign(payload));
    }
}