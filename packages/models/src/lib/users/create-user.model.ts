export interface CreateUser {
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly inviteCode?: string;
    readonly agreedToPolicies: boolean;
}
