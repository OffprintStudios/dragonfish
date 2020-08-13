import { Roles } from "src/db/users/models";

export interface CreateDoc {
    readonly _id: string;
    readonly docName: string;
    readonly docDescription: string;
    readonly docBody: string;
    readonly approvedRoles: Roles[];
}