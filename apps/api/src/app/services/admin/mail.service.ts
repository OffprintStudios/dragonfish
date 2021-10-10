import { Injectable, Logger } from '@nestjs/common';
import { Account } from '@dragonfish/shared/models/accounts';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class MailService {
    private logger = new Logger('Mail');

    constructor(private readonly sendGrid: SendGridService) {}

    public async sendResetPasswordEmail(user: Account, token: string) {
        await this.sendGrid.send({
            to: user.email,
            templateId: process.env.RESET_PASSWORD_TEMPLATE,
            dynamicTemplateData: {
                url: `https://offprint.net/account/reset-password?userId=${user._id}&token=${token}`,
            },
        });
    }

    public async sendConfirmationEmail(user: Account, token: string) {
        await this.sendGrid.send({
            to: user.email,
            templateId: process.env.CONFIRM_EMAIL_TEMPLATE,
            dynamicTemplateData: {
                url: `https://offprint.net/account/confirm-email?userId=${user._id}&token=${token}`,
            },
        });
    }

    public async sendInviteCode(email: string, inviteCode: string) {
        this.logger.log(`Sending invite code ${inviteCode}...`);
        await this.sendGrid.send({
            to: email,
            templateId: process.env.INVITE_CODE_TEMPLATE,
            dynamicTemplateData: {
                code: inviteCode,
            },
        });
    }
}
