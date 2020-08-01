import { Controller, UseGuards, Post, Body, Request, Get, UnauthorizedException, Patch, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetCookies, Cookies } from '@nestjsplus/cookies';
import { v4 as uuidV4 } from 'uuid';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import { ImagesService } from '../images/images.service';
import { AuthGuard, RefreshGuard } from 'src/guards';
import * as models from 'src/db/users/models';
import { FolderTypes } from 'src/api/images/models';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService, 
        private readonly usersService: UsersService,
        private readonly imagesService: ImagesService) {}

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
    async login(@Request() req: any, @Body() loginUser: models.LoginUser, @Cookies() cookies: any): Promise<models.FrontendUser> {
        // Check for stray sessions from previous logout attempts that the server never received
        let oldSessionId: string | null = cookies['refreshToken'];        

        const verifiedUser = await this.authService.validateUser(loginUser.email, loginUser.password);
        const sessionId = uuidV4();
        await this.usersService.addRefreshToken(verifiedUser._id, sessionId);
        if (oldSessionId) {
            await this.usersService.clearRefreshToken(verifiedUser._id, oldSessionId);
        }
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

    @UseGuards(AuthGuard)    
    @SetCookies()
    @Get('logout')
    async logout(@Request() req: any, @Cookies() cookies: any) : Promise<void> {        
        const refreshToken = cookies['refreshToken'];
        await this.usersService.clearRefreshToken(req.user.sub, refreshToken);
        this.authService.logout(req);        
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
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: Express.Multer.File, @Req() req: any) {        
        const avatarUrl = await this.imagesService.upload(avatarImage, req.user.sub, 'avatars');
        const avatar = `https://images.offprint.net/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.authService.updateAvatar(req.user, avatar);
    }
}
