import { FrontendUser } from '@pulp-fiction/models/users';

export interface UserStateModel {
    currUser: FrontendUser | null;
}