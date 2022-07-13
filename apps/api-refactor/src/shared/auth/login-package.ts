import { FrontendAccount } from '$shared/models/accounts';

export interface LoginPackage {
  account: FrontendAccount;
  accessToken: string;
}
