import { InviteCodes, Roles } from '@dragonfish/shared/models/users';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersStore } from '@dragonfish/api/database/users';
import { RolesGuard } from '../../guards';
import { MailService } from '@dragonfish/api/mail';
import * as sanitize from 'sanitize-html';

@Controller('user-management')
export class UserManagementController {
    constructor(private readonly users: UsersStore, private readonly mailService: MailService) {}

    @UseGuards(RolesGuard([Roles.Moderator, Roles.Admin]))
    @Get('generate-code')
    async generateCode(): Promise<InviteCodes> {
        return await this.users.generateInviteCode();
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator]))
    @Post('send-invite-code')
    async sendInviteCode(@Body() data: { emailAddress: string }) {
        const inviteCode = await this.users.generateInviteCode();
        await this.mailService.sendInviteCode(sanitize(data.emailAddress), inviteCode._id);
    }
}
