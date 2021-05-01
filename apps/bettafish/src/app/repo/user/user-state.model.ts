import { FrontendUser } from '@dragonfish/shared/models/users';

export interface UserStateModel {
    currUser: FrontendUser | null;
}
