import type { Role } from "./role";

export interface Account {
    readonly id: string;
    readonly roles: [Role];
    readonly termsAgree: boolean;
    readonly emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly token?: string;
}