import { FrontendUser } from '@dragonfish/shared/models/users';

export interface Note {
    readonly _id: string;
    readonly user: string | FrontendUser;
    body: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
