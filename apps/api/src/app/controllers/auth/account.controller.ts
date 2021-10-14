import { Controller, UseGuards, Patch, Body, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ChangeEmail, ChangePassword, ResetPassword, Roles } from '@dragonfish/shared/models/accounts';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { AccountService } from '../../services/auth/account.service';

@Controller('account')
export class AccountController {
    constructor(private readonly accounts: AccountService) {}

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-email')
    async changeEmail(@User() user: JwtPayload, @Body() changeEmailRequest: ChangeEmail) {
        // TODO: handle email changes
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-password')
    async changePassword(@User() user: JwtPayload, @Body() newPassword: ChangePassword) {
        // TODO: handle password changes
    }

    @ApiTags(DragonfishTags.Users)
    @Post('send-reset-email')
    async sendResetEmail(@Body() data: { email: string }) {
        console.log(data.email);
        return await this.accounts.sendResetPasswordCode(data.email);
    }

    @ApiTags(DragonfishTags.Users)
    @Patch('reset-password')
    async resetPassword(@Body() resetForm: ResetPassword) {
        return await this.accounts.resetPassword(resetForm);
    }
}
