import { FrontendUser } from '@dragonfish/models/users';

export interface UserStateModel {
    currUser: FrontendUser | null;
}