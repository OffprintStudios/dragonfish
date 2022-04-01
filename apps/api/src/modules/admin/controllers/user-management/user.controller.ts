import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '$modules/accounts';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { RolesGuard } from '$shared/guards';
import { InviteCodes, Roles } from '$shared/models/accounts';
import { Identity } from '$shared/auth';

@Controller('user')
export class UserController {
    constructor(private readonly users: UserService, private readonly sendgrid: SendGridService) {}

    @UseGuards(RolesGuard)
    @Identity(Roles.Moderator, Roles.Admin)
    @Get('generate-code')
    async generateCode(): Promise<InviteCodes> {
        return await this.users.createInviteCode();
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.Moderator, Roles.Admin)
    @Post('send-invite-code')
    async sendInviteCode(@Body() data: { emailAddress: string }) {
        const inviteCode = await this.users.createInviteCode();
        await this.sendgrid.send({
            to: data.emailAddress,
            templateId: process.env.INVITE_CODE_TEMPLATE,
            dynamicTemplateData: {
                code: inviteCode._id,
            },
        });
    }
}
