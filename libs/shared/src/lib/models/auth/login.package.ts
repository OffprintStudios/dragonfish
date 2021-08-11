import { Account } from '../accounts';

export interface LoginPackage {
    readonly account: Account;
    readonly token: string;
}
