import { Reflector } from '@nestjs/core';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { Roles } from '$shared/models/accounts';
import { JwtPayload } from '../auth';
import { AuthService } from '$modules/accounts/services/auth.service';

/**
 * This guard checks to see if a pseudonym belongs to the user making the request.
 *
 * @param roles The roles required to activate the associated route
 * @param optional Checks to see if this guard is optional
 */
@Injectable()
export class IdentityGuard implements CanActivate {
    private logger = new Logger(`IdentityGuard`);

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly auth: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Roles[]>('identity', context.getHandler());
        const optional = this.reflector.get<boolean>('optional', context.getHandler());

        if (!roles) {
            return false;
        }

        const request = context.switchToHttp().getRequest();

        if (optional) {
            const jwtToken: string = request.headers['authorization'];
            if (jwtToken) {
                return await this.verifyTokenNoPseud(request, roles);
            } else {
                return true;
            }
        } else {
            return await this.verifyToken(request, roles);
        }
    }

    private async verifyToken(request, roles: Roles[]): Promise<boolean> {
        // Getting the JSON Web Token from the authorization header.
        const jwtToken: string = request.headers['authorization'];

        // Getting the pseudonym query parameter
        const pseudId: string = request.query.pseudId.toString();
        if (!pseudId) {
            throw new BadRequestException(
                `This route requires a pseudonym ID in query parameters.`,
            );
        }

        // Checking to see if the token matches the correct format.
        // If it does, then grab the token. If not, throw an
        // Unauthorized exception.
        let bearerToken: string;
        if (jwtToken && jwtToken.startsWith('Bearer ')) {
            bearerToken = jwtToken.substring(7, jwtToken.length);
        } else {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }

        // Verifying that the token is legitimate.
        const verifiedToken = await this.jwtService
            .verifyAsync<JwtPayload>(bearerToken, { ignoreExpiration: false })
            .catch((err) => {
                if (err instanceof TokenExpiredError) {
                    throw new UnauthorizedException(`Your token has expired`);
                } else {
                    throw err;
                }
            });

        // Check to see if the account owns the pseudonym
        if (await this.auth.verifyPseudonym(verifiedToken.sub, pseudId)) {
            if (await this.auth.checkRoles(verifiedToken.sub, ...roles)) {
                request.user = verifiedToken;
                return true;
            } else {
                this.logger.error(`Someone attempted to impersonate User ${verifiedToken.sub}!`);
                throw new UnauthorizedException(`You don't have permission to do that.`);
            }
        } else {
            this.logger.error(`Someone attempted to impersonate User ${verifiedToken.sub}!`);
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
    }

    private async verifyTokenNoPseud(request, roles: Roles[]): Promise<boolean> {
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
