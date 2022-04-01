import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { Cookies, SetCookies } from '@nestjsplus/cookies';
import { RefreshGuard, RolesGuard } from '$shared/guards';
import { User, LoginPackage, JwtPayload, Identity } from '$shared/auth';
import { Device, DeviceInfo } from '$shared/util';
import { AuthService } from '../services';
import { AccountForm, Login, PseudonymForm, Pseudonym, Roles } from '$shared/models/accounts';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @SetCookies()
    @Post('register')
    async register(
        @Request() req,
        @Device() device: DeviceInfo,
        @Body() formInfo: AccountForm,
    ): Promise<LoginPackage> {
        return await this.auth.register(req, device, formInfo);
    }

    @SetCookies()
    @Post('login')
    async login(
        @Request() req,
        @Device() device: DeviceInfo,
        @Body() login: Login,
        @Cookies() cookies,
    ): Promise<LoginPackage> {
        // Check for stray sessions from previous logout attempts that the server never received
        const oldSessionId: string | null = cookies['refreshToken'];

        const verifiedUser = await this.auth.validateAccount(login.email, login.password);
        if (!verifiedUser) {
            throw new NotFoundException(
                `No user with those credentials found. Have you signed up?`,
            );
        }

        if (oldSessionId) {
            await this.auth.clearRefreshToken(verifiedUser._id, oldSessionId);
        }

        return this.auth.login(verifiedUser, req, device, login.rememberMe);
    }

    @Get('refresh-token')
    @UseGuards(RefreshGuard)
    async refreshToken(
        @User() user: JwtPayload,
        @Cookies() cookies,
    ): Promise<{ newToken: string }> {
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

    @Get('logout')
    @UseGuards(RefreshGuard)
    @SetCookies()
    async logout(@Request() req, @Cookies() cookies): Promise<void> {
        const refreshToken = cookies['refreshToken'];
        if (refreshToken) {
            await this.auth.clearRefreshToken(req.user.sub, refreshToken);
        }
        return await this.auth.logout(req);
    }

    @Post('add-pseudonym')
    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    async addPseudonym(
        @User() user: JwtPayload,
        @Body() formData: PseudonymForm,
    ): Promise<Pseudonym> {
        return await this.auth.createPseudonym(user, formData);
    }
}
