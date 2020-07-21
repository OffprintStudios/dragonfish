import { Controller, UseGuards, Post, Body, Request, Get, UnauthorizedException, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedCookies, SetCookies, ClearCookies, Cookies } from '@nestjsplus/cookies';
import { v4 as uuidV4 } from 'uuid';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import * as models from 'src/db/users/models';
import { AuthGuard, RefreshGuard } from 'src/guards';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    /* Login and Registration*/

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

    @UseGuards(RefreshGuard)
    @Get('refresh-token')
    async refreshToken(@Request() req: any, @Cookies() cookies: any): Promise<models.FrontendUser> {
        const refreshToken = cookies['refreshToken'];
        if (refreshToken) {
            if (await this.usersService.checkRefreshToken(req.user.sub, refreshToken)) {
                // If the refresh token is valid, let's generate a new JWT.
                return this.authService.refreshLogin(req.user);
            }
        } else {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
    }

    @Get('logout')
    async logout() {
        return "yo there"; // This needs to remove a session ID from a user's document.
    }

    /* Account settings */

    @UseGuards(AuthGuard)
    @Patch('change-name-and-email')
    async changeNameAndEmail(@Request() req: any, @Body() newNameAndEmail: models.ChangeNameAndEmail) {
        return await this.authService.changeNameAndEmail(req.user, newNameAndEmail);
    }

    @UseGuards(AuthGuard)
    @Patch('change-password')
    async changePassword(@Request() req: any, @Body() newPassword: models.ChangePassword) {
        return await this.authService.changePassword(req.user, newPassword);
    }

    @UseGuards(AuthGuard)
    @Patch('update-profile')
    async updateProfile(@Request() req: any, @Body() newProfile: models.ChangeProfile) {
        return await this.authService.updateProfile(req.user, newProfile);
    }

    @UseGuards(AuthGuard)
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@UploadedFile() avatar: any) {
        
    }
}
