import { Controller, Request, Body, Get, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetCookies, Cookies } from '@nestjsplus/cookies';
import { RefreshGuard } from '../../guards';
import { User, Device } from '@dragonfish/api/utilities/decorators';
import { JwtPayload, LoginPackage } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { DeviceInfo } from '@dragonfish/api/utilities/models';
import { AuthService } from '../../services/auth';
import { AccountForm, LoginModel } from '@dragonfish/shared/models/accounts';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @ApiTags(DragonfishTags.Auth)
    @SetCookies()
    @Post('register')
    async register(@Request() req, @Device() device: DeviceInfo, @Body() formInfo: AccountForm): Promise<LoginPackage> {
        return await this.auth.register(req, device, formInfo);
    }

    @ApiTags(DragonfishTags.Auth)
    @SetCookies()
    @Post('login')
    async login(
        @Request() req,
        @Device() device: DeviceInfo,
        @Body() login: LoginModel,
        @Cookies() cookies,
    ): Promise<LoginPackage> {
        // Check for stray sessions from previous logout attempts that the server never received
        const oldSessionId: string | null = cookies['refreshToken'];

        const verifiedUser = await this.auth.validateAccount(login.email, login.password);

        if (oldSessionId) {
            await this.auth.clearRefreshToken(verifiedUser._id, oldSessionId);
        }

        return this.auth.login(verifiedUser, req, device, login.rememberMe);
    }

    @ApiTags(DragonfishTags.Auth)
    @UseGuards(RefreshGuard)
    @Get('refresh-token')
    async refreshToken(@User() user: JwtPayload, @Cookies() cookies): Promise<{ newToken: string }> {
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

    @ApiTags(DragonfishTags.Auth)
    @UseGuards(RefreshGuard)
    @SetCookies()
    @Get('logout')
    async logout(@Request() req, @Cookies() cookies): Promise<void> {
        const refreshToken = cookies['refreshToken'];
        if (refreshToken) {
            await this.auth.clearRefreshToken(req.user.sub, refreshToken);
        }
        return await this.auth.logout(req);
    }
}
