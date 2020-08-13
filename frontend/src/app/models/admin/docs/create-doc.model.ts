import { Roles } from 'src/app/models/users';

export interface CreateDoc {
    readonly _id: string;
    readonly docName: string;
    readonly docDescription: string;
    readonly docBody: string;
    readonly approvedRoles: Roles[];
}