export interface JwtPayload {
    readonly username: string;
    readonly roles: string[];
    readonly sub: string;
    readonly exp?: number;
    readonly iat?: number;
}
