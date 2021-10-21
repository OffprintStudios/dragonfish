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
import { Roles, Account } from '@dragonfish/shared/models/accounts';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { AccountsStore } from '@dragonfish/api/database/accounts/stores';
import { isAllowed } from '@dragonfish/shared/functions';
import { Reflector } from '@nestjs/core';

/**
 * This guard checks to see if a pseudonym belongs to the user making the request.
 *
 * @param roles The roles required to activate the associated route
 * @param optional Checks to see if this guard is optional
 */
@Injectable()
export class IdentityGuard implements CanActivate {
    private logger = new Logger(`IdentityGuard`);

    constructor(private reflector: Reflector, private jwtService: JwtService, private accountStore: AccountsStore) {}

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
                return await this.verifyToken(request, roles);
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
            throw new BadRequestException(`This route requires a pseudonym ID in query parameters.`);
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
        const account: Account = await this.accountStore.fetchAccountById(verifiedToken.sub);
        if (account.pseudonyms.some((elem) => elem._id === pseudId)) {
            if (isAllowed(account.roles, roles)) {
                request.user = verifiedToken;
                return true;
            } else {
                this.logger.error(`Someone attempted to impersonate User ${account._id}!`);
                throw new UnauthorizedException(`You don't have permission to do that.`);
            }
        } else {
            this.logger.error(`Someone attempted to impersonate User ${account._id}!`);
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
    }
}
