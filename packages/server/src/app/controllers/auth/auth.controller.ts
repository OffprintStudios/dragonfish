import { Controller, Request, Body, Get, Post, UseGuards, ForbiddenException, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetCookies, Cookies } from '@nestjsplus/cookies';
import { nanoid } from 'nanoid';

import { RefreshGuard } from '../../guards';
import { CreateUserDTO, LoginUserDTO } from './models';
import { FrontendUser } from '@dragonfish/models/users';
import { IAuth } from '../../shared/auth';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';

@Controller('auth')
export class AuthController {
    constructor(@Inject('IAuth') private readonly auth: IAuth) {}

    @ApiTags('Auth')
    @SetCookies()
    @Post('register')
    async register(@Request() req: any, @Body() newUser: CreateUserDTO): Promise<FrontendUser> {
        return await this.auth.register(req, newUser);
    }

    @ApiTags('Auth')
    @SetCookies()
    @Post('login')
    async login(@Request() req: any, @Body() loginUser: LoginUserDTO, @Cookies() cookies: any): Promise<FrontendUser> {
        // Check for stray sessions from previous logout attempts that the server never received
        let oldSessionId: string | null = cookies['refreshToken'];

        const verifiedUser = await this.auth.validateUser(loginUser.email, loginUser.password);

        if (oldSessionId) {
            await this.auth.clearRefreshToken(verifiedUser._id, oldSessionId);
        }

        if (loginUser.rememberMe) {
            const sessionId = nanoid();
            const newSession = await this.auth.addRefreshToken(verifiedUser._id, sessionId);
            return this.auth.login(verifiedUser, req, sessionId, newSession.expires);
        } else {
            return this.auth.login(verifiedUser, req);
        }
    }

    @ApiTags('Auth')
    @UseGuards(RefreshGuard)
    @Get('refresh-token')
    async refreshToken(@User() user: JwtPayload, @Cookies() cookies: any): Promise<{ newToken: string }> {
        const refreshToken = cookies['refreshToken'];
        if (refreshToken) {
            if (await this.auth.checkRefreshToken(user.sub, refreshToken)) {
                // If the refresh token is valid, let's generate a new JWT.
                return { newToken: await this.auth.refreshLogin(user) };
            } else {
                throw new ForbiddenException(`Your login has expired. Please log back in.`);
            }
        } else {
            throw new ForbiddenException(`Your refresh token is invalid.`);
        }
    }

    @ApiTags('Auth')
    @UseGuards(RefreshGuard)
    @SetCookies()
    @Get('logout')
    async logout(@Request() req: any, @Cookies() cookies: any): Promise<void> {
        const refreshToken = cookies['refreshToken'];
        await this.auth.clearRefreshToken(req.user.sub, refreshToken);
        this.auth.logout(req);
    }
}
