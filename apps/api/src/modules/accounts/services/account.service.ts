import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AccountsStore } from '../db/stores';
import { ResetPassword } from '$shared/models/accounts';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class AccountService {
    private logger = new Logger('Accounts');

    constructor(
        private readonly accountStore: AccountsStore,
        private readonly mail: SendGridService,
    ) {}

    public async changeEmail() {
        // TODO: implement email changes
    }

    public async changePassword() {
        // TODO: implement password changes
    }

    public async sendResetPasswordCode(email: string) {
        const account = await this.accountStore.fetchAccountByEmail(email);
        if (account) {
            const resetCode = await this.accountStore.createRecoveryCode(account._id);
            await this.mail.send({
                to: account.email,
                templateId: process.env.RESET_PASSWORD_TEMPLATE,
                dynamicTemplateData: {
                    url: `https://offprint.net/registration/reset-password?userId=${account._id}&token=${resetCode}`,
                },
            });
        } else {
            this.logger.warn(
                `Someone has attempted to reset the password of a non-existent account.`,
            );
        }
    }

    public async resetPassword(resetForm: ResetPassword) {
        if (await this.accountStore.verifyResetAndUpdatePassword(resetForm)) {
            return;
        } else {
            this.logger.warn(
                `Someone has attempted to reset the password of Account ID: ${resetForm.accountId}!`,
            );
            throw new UnauthorizedException(`You don't have permission to do that!`);
        }
    }
}
