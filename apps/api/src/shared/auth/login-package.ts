import { FrontendAccount } from '$shared/models/accounts';

export interface LoginPackage {
    readonly account: FrontendAccount;
    readonly token: string;
}
