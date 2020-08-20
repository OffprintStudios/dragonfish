import { Controller, UseGuards, Post, Body, Request, Get, Patch, UseInterceptors, UploadedFile, Req, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetCookies, Cookies } from '@nestjsplus/cookies';
import { v4 as uuidV4 } from 'uuid';

import { AuthService } from './auth.service';
import { UsersService } from 'src/db/users/users.service';
import { ImagesService } from '../images/images.service';
import { AuthGuard, RefreshGuard } from 'src/guards';
import * as models from 'shared/models/users';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly imagesService: ImagesService) { }

    /* Login and Registration*/

    @SetCookies()
    @Post('register')
    async register(@Request() req: any, @Body() newUser: models.CreateUser): Promise<models.FrontendUser> {
        const addedUser = await this.usersService.createUser(newUser);
        const sessionId = uuidV4();
        const newSession = await this.usersService.addRefreshToken(addedUser._id, sessionId);
        return this.authService.login(addedUser, req, sessionId, newSession.expires);
    }

    @SetCookies()
    @Post('login')
    async login(@Request() req: any, @Body() loginUser: models.LoginUser, @Cookies() cookies: any): Promise<models.FrontendUser> {
        // Check for stray sessions from previous logout attempts that the server never received
        let oldSessionId: string | null = cookies['refreshToken'];

        const verifiedUser = await this.authService.validateUser(loginUser.email, loginUser.password);

        if (oldSessionId) {
            await this.usersService.clearRefreshToken(verifiedUser._id, oldSessionId);
        }

        if (loginUser.rememberMe) {
            const sessionId = uuidV4();
            const newSession = await this.usersService.addRefreshToken(verifiedUser._id, sessionId);
            return this.authService.login(verifiedUser, req, sessionId, newSession.expires);
        } else {
            return this.authService.login(verifiedUser, req);
        }

    }

    @UseGuards(RefreshGuard)
    @Get('refresh-token')
    async refreshToken(@Request() req: any, @Cookies() cookies: any): Promise<models.FrontendUser> {
        const refreshToken = cookies['refreshToken'];
        if (refreshToken) {
            if (await this.usersService.checkRefreshToken(req.user.sub, refreshToken)) {
                // If the refresh token is valid, let's generate a new JWT.
                return this.authService.refreshLogin(req.user);
            } else {
                throw new ForbiddenException(`Your login has expired. Please log back in.`);
            }
        } else {
            throw new ForbiddenException(`Your refresh token is invalid.`);
        }
    }

    @UseGuards(RefreshGuard)
    @SetCookies()
    @Get('logout')
    async logout(@Request() req: any, @Cookies() cookies: any): Promise<void> {
        const refreshToken = cookies['refreshToken'];
        await this.usersService.clearRefreshToken(req.user.sub, refreshToken);
        this.authService.logout(req);
    }

    /* Account settings */

    @UseGuards(AuthGuard)
    @Patch('change-email')
    async changeEmail(@Request() req: any, @Body() changeEmailRequest: models.ChangeEmail) {
        return await this.authService.changeEmail(req.user, changeEmailRequest);
    }

    @UseGuards(AuthGuard)
    @Patch('change-username')
    async changeUsername(@Request() req: any, @Body() changeUsernameRequest: models.ChangeUsername) {
        // TODO: Determine how we want to handle this.
        // We should decide what--and if we need--restrictions to have around name changes.
        //return await this.authService.changeUsername(req.user, changeUsernameRequest);
    }

    @UseGuards(AuthGuard)
    @Patch('change-password')
    async changePassword(@Request() req: any, @Body() newPassword: models.ChangePassword) {
        return await this.authService.changePassword(req.user, newPassword);
    }

    @UseGuards(AuthGuard)
    @Patch('update-profile')
    async updateProfile(@Request() req: any, @Body() newProfile: models.ChangeProfile) {
        if (newProfile.bio && newProfile.bio.length > 50) { 
            throw new BadRequestException("Your bio must not be longer than 50 characters.");
        }
        return await this.authService.updateProfile(req.user, newProfile);
    }

    @UseGuards(AuthGuard)
    @Post('agree-to-policies')
    async agreeToPolicies(@Request() req: any): Promise<models.FrontendUser> {
        return await this.authService.agreeToPolicies(req.user);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @Req() req: any) {
        const avatarUrl = await this.imagesService.upload(avatarImage, req.user.sub, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.authService.updateAvatar(req.user, avatar);
    }
}
