import { Controller, UseGuards, Post, Body, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignedCookies, SetCookies, ClearCookies } from '@nestjsplus/cookies';
import { v4 as uuidv4 } from 'uuid';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import * as models from 'src/db/users/models';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('local'))
    @SetCookies({httpOnly: false, secure: true, path: '/'}, {name: 'refreshToken', value: uuidv4()})
    @Post('login')
    async login(@Request() req: any): Promise<models.FrontendUser> {
        return this.authService.login(req.user);
    }

    @SetCookies({httpOnly: false, secure: true, path: '/'}, {name: 'refreshToken', value: uuidv4()})
    @Post('register')
    async register(@Body() newUser: models.CreateUser): Promise<models.FrontendUser> {
        const user = await this.usersService.createUser(newUser);
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @ClearCookies('refreshToken')
    @Get('logout')
    async logout() {
        // do nothing yet
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('check-status')
    async checkStatus(@SignedCookies('refreshToken') refreshToken: any) {
        console.log('refreshToken Value: ', refreshToken);
    }
}