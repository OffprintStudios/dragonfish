import { Controller, UseGuards, Post, Body, Request, Get } from '@nestjs/common';
import { SignedCookies, SetCookies, ClearCookies, Cookies } from '@nestjsplus/cookies';
import { v4 as uuidV4 } from 'uuid';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import * as models from 'src/db/users/models';
import { AuthGuard } from './auth.guard';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @SetCookies()
    @Post('register')
    async register(@Request() req: any, @Body() newUser: models.CreateUser): Promise<models.FrontendUser> {
        const addedUser = await this.usersService.createUser(newUser);
        const sessionId = uuidV4();
        await this.usersService.addRefreshToken(addedUser._id, sessionId);
        return this.authService.login(addedUser, req, sessionId);
    }

    @SetCookies()
    @Post('login')
    async login(@Request() req: any, @Body() loginUser: models.LoginUser): Promise<models.FrontendUser> {
        const verifiedUser = await this.authService.validateUser(loginUser.email, loginUser.password);
        const sessionId = uuidV4();
        await this.usersService.addRefreshToken(verifiedUser._id, sessionId);
        return this.authService.login(verifiedUser, req, sessionId);
    }

    @UseGuards(AuthGuard)
    @Get('logout')
    async logout() {
        return "yo there";
    }
}
