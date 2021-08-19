import { FrontendAccount } from '../accounts';

export interface LoginPackage {
    readonly account: FrontendAccount;
    readonly token: string;
}
