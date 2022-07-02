import type { Account } from "./account";

export interface LoginPackage {
    account: Account;
    token: string;
}
