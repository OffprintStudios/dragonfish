export interface JwtPayload {
    readonly username: string;
    readonly roles: string[];
    readonly sub: string;
}
