import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { Roles } from '$shared/models/accounts';
import { JwtPayload } from '../auth';
import { Reflector } from '@nestjs/core';
import { AuthService } from '$modules/accounts/services/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly auth: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Roles[]>('identity', ctx.getHandler());
        const request = ctx.switchToHttp().getRequest();

        // Getting the JSON Web Token from the authorization header.
        const jwtToken: string = request.headers['authorization'];

        // Checking to see if the token matches the correct format.
        // If it does, then grab the token. If not, throw an
        // Unauthorized exception.
        let bearerToken: string;
        if (jwtToken.startsWith('Bearer ')) {
            bearerToken = jwtToken.substring(7, jwtToken.length);
        } else {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }

        // Verifying that the token is legitimate.
        let verifiedToken: JwtPayload;
        try {
            verifiedToken = this.jwtService.verify<JwtPayload>(bearerToken, {
                ignoreExpiration: false,
            });
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException('Your token has expired.');
            } else {
                throw err;
            }
        }

        if (verifiedToken) {
            if (await this.auth.checkRoles(verifiedToken.sub, ...roles)) {
                request.user = verifiedToken;
                return true;
            } else {
                throw new UnauthorizedException(`You don't have permission to do that.`);
            }
        } else {
            return false;
        }
    }
}
