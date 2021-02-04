import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

import { JwtPayload } from '@dragonfish/models/auth';

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Getting the request.
        const request = context.switchToHttp().getRequest();

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
        let verifiedToken;
        try {
            verifiedToken = this.jwtService.verify<JwtPayload>(bearerToken, { ignoreExpiration: true });
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException('Your token has expired.');
            } else {
                throw err;
            }
        }

        if (verifiedToken) {
            // If the token is legitimate, then pass it straight along to the request.
            request.user = verifiedToken;
            return true;
        } else {
            // Otherwise, throw an Unauthorized exception.
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
    }
}
