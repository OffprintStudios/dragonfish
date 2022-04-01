import { Controller, UseGuards, Patch, Body, Post } from '@nestjs/common';
import { RolesGuard } from '$shared/guards';
import { ChangeEmail, ChangePassword, ResetPassword, Roles } from '$shared/models/accounts';
import { User, JwtPayload, Identity } from '$shared/auth';
import { AccountService } from '../services';

@Controller('account')
export class AccountController {
    constructor(private readonly accounts: AccountService) {}

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('change-email')
    async changeEmail(@User() user: JwtPayload, @Body() changeEmailRequest: ChangeEmail) {
        // TODO: handle email changes
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('change-password')
    async changePassword(@User() user: JwtPayload, @Body() newPassword: ChangePassword) {
        // TODO: handle password changes
    }

    @Post('send-reset-email')
    async sendResetEmail(@Body() data: { email: string }) {
        return await this.accounts.sendResetPasswordCode(data.email);
    }

    @Patch('reset-password')
    async resetPassword(@Body() resetForm: ResetPassword) {
        return await this.accounts.resetPassword(resetForm);
    }
}
