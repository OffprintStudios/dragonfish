import { Controller, UseGuards, Post, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import * as models from 'src/db/users/models';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req: any): Promise<models.FrontendUser> {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() newUser: models.CreateUser): Promise<models.FrontendUser> {
        const user = await this.usersService.createUser(newUser);
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout() {
        // do nothing yet
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('check-status')
    async checkStatus() {
        // does nothing yet
    }
}