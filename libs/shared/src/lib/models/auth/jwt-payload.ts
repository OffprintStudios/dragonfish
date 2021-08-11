export interface JwtPayload {
    readonly roles: string[];
    readonly sub: string;
    readonly exp?: number;
    readonly iat?: number;
}
