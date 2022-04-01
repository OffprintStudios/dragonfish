import type { Account } from '$lib/models/accounts';

export interface LoginPackage {
    account: Account;
    token: string;
}
