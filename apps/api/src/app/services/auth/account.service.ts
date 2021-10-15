import { AccountsStore } from '@dragonfish/api/database/accounts/stores';
import { MailService } from '../admin/mail.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ResetPassword } from '@dragonfish/shared/models/accounts';

@Injectable()
export class AccountService {
    private logger = new Logger('Accounts');

    constructor(private readonly accountStore: AccountsStore, private readonly mail: MailService) {}

    public async changeEmail() {}

    public async changePassword() {}

    public async sendResetPasswordCode(email: string) {
        const account = await this.accountStore.fetchAccountByEmail(email);
        if (account) {
            const resetCode = await this.accountStore.createRecoveryCode(account._id);
            await this.mail.sendResetPasswordEmail(account, resetCode);
        } else {
            this.logger.warn(`Someone has attempted to reset the password of a non-existent account.`);
        }
    }

    public async resetPassword(resetForm: ResetPassword) {
        if (await this.accountStore.verifyResetAndUpdatePassword(resetForm)) {
            return;
        } else {
            this.logger.warn(`Someone has attempted to reset the password of Account ID: ${resetForm.accountId}!`);
            throw new UnauthorizedException(`You don't have permission to do that!`);
        }
    }
}
