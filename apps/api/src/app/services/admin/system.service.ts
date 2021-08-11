import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { AccountsStore, PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import { UsersStore } from '@dragonfish/api/database/users';

@Injectable()
export class SystemService implements OnApplicationBootstrap {
    private logger = new Logger('System');

    constructor(
        private readonly accountStore: AccountsStore,
        private readonly pseudStore: PseudonymsStore,
        private readonly usersStore: UsersStore,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        this.logger.log(`Initializing application bootstrapping...`);

        this.logger.log(`Migrating users from Users collection to Accounts and Pseudonyms...`);
        const allUsers = await this.usersStore.retrieveAllUsers();

        this.logger.log(`Unprocessed accounts: ${allUsers.length}`);

        for (let i = 0; i < allUsers.length; i++) {
            this.logger.log(`Processing user #${i + 1} (ID: ${allUsers[i]._id})...`);
            const account = await this.accountStore.migrateAccount(allUsers[i]).catch(() => {
                this.logger.error(
                    `User ${allUsers[i]._id} could not be migrated! Account document failed to be added.`,
                );
                throw new Error(`Migration Failed (Account Step)`);
            });
            const pseud = await this.pseudStore.migrateAccount(allUsers[i], account._id).catch(() => {
                this.logger.error(
                    `User ${allUsers[i]._id} could not be migrated! Pseudonym document failed to be added.`,
                );
                throw new Error(`Migration Failed (Pseudonym Step)`);
            });
            await this.accountStore.addPseudonym(account._id, (pseud as any)._id).catch(() => {
                this.logger.error(`User ${allUsers[i]._id} could not be migrated! Pseudonym failed association.`);
                throw new Error(`Migration Failed (Pseudonym Could Not Be Added)`);
            });
            await this.usersStore.markAsMigrated(allUsers[i]._id).then(() => {
                this.logger.log(`User ${allUsers[i]._id} migrated successfully!`);
            });
        }

        this.logger.log(`All accounts migrated successfully!`);
    }
}
