export interface ResetPassword {
    readonly accountId: string;
    readonly resetCode: string;
    readonly newPassword: string;
}
