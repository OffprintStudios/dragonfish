import { FrontendUser } from '@pulp-fiction/models/users';

export interface AuthStateModel {
    user: FrontendUser | null;
    token: string | null;
    error?: string;
}