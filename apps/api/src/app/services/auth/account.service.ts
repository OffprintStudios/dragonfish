import { AccountsStore } from '@dragonfish/api/database/accounts/stores';
import { MailService } from '@dragonfish/api/mail';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountService {
    private logger = new Logger('Accounts');

    constructor(private readonly accountStore: AccountsStore, private readonly mail: MailService) {}

    public async changeEmail() {}

    public async changePassword() {}
}
