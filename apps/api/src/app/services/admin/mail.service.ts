import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Account } from '@dragonfish/shared/models/accounts';

@Injectable()
export class MailService {
    private logger = new Logger('Mail');

    constructor(private mailer: MailerService) {}

    public async sendResetEmail(user: Account, token: string) {
        const url = `https://offprint.net/account/reset-password?userId=${user._id}&token=${token}`;

        await this.mailer.sendMail({
            to: user.email,
            subject: 'Resetting your Offprint password',
            template: './reset_password',
            context: {
                url,
            },
        });
    }

    public async sendConfirmationEmail(user: Account, token: string) {
        const url = `https://offprint.net/account/confirm-email?userId=${user._id}&token=${token}`;

        await this.mailer.sendMail({
            to: user.email,
            subject: 'Welcome to Offprint! Please confirm your email address',
            template: './confirm_email',
            context: {
                url,
            },
        });
    }

    public async sendInviteCode(email: string, inviteCode: string) {
        this.logger.log(`Sending invite code ${inviteCode}...`);
        await this.mailer.sendMail({
            to: email,
            subject: 'Welcome to Offprint!',
            template: './invite_code',
            context: {
                inviteCode,
            },
        });
    }
}
