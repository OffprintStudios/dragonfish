import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies, SetCookies } from '@nestjsplus/cookies';
import { RefreshGuard, RolesGuard } from '../../guards';
import { Device, User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload, LoginPackage } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { DeviceInfo } from '@dragonfish/api/utilities/models';
import { AuthService } from '../../services/auth';
import { AccountForm, LoginModel, PseudonymForm, Pseudonym } from '@dragonfish/shared/models/accounts';
import { Roles } from '@dragonfish/shared/models/users';

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
        if (!verifiedUser) {
            throw new NotFoundException(`No user with those credentials found. Have you signed up?`);
        }

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

    @ApiTags(DragonfishTags.Auth)
    @UseGuards(RolesGuard([Roles.User]))
    @Post('add-pseudonym')
    async addPseudonym(@User() user: JwtPayload, @Body() formData: PseudonymForm): Promise<Pseudonym> {
        return await this.auth.createPseudonym(user, formData);
    }

    @ApiTags(DragonfishTags.Auth)
    @UseGuards(RolesGuard([Roles.User]))
    @Get('user-tag-exists')
    async userTagExists(@Query('userTag') userTag: string): Promise<boolean> {
        return await this.auth.userTagExists(userTag);
    }
}
