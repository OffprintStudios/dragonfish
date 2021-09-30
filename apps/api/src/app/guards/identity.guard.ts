import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    mixin,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { Roles, Account } from '@dragonfish/shared/models/accounts';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { AccountsStore, PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import { isAllowed } from '@dragonfish/shared/functions';

/**
 * This guard mixin checks to see if a pseudonym belongs to the user making the request.
 *
 * @param roles The roles required to activate the associated route
 * @param optional Checks to see if this guard is optional
 */
export const IdentityGuard = (roles: Roles[], optional?: boolean) => {
    @Injectable()
    class IdentityGuardMixin implements CanActivate {
        logger = new Logger(`Identity Guard`);

        constructor(
            private readonly accountStore: AccountsStore,
            private readonly pseudStore: PseudonymsStore,
            private readonly jwtService: JwtService,
        ) {}

        async canActivate(context: ExecutionContext) {
            this.logger.log(`Getting the request.`);
            // Getting the request.
            const request = context.switchToHttp().getRequest();

            if (optional) {
                if (request.headers['authorization']) {
                    return await this.verifyToken(request);
                } else {
                    return true;
                }
            } else {
                return await this.verifyToken(request);
            }
        }

        private async verifyToken(request: any): Promise<boolean> {
            this.logger.log(`Getting the JSON Web Token from the authorization header.`);
            // Getting the JSON Web Token from the authorization header.
            const jwtToken: string = request.headers['authorization'];

            this.logger.log(`Getting the pseudonym query parameter`);
            // Getting the pseudonym query parameter
            const pseudId: string = request.query.pseudId.toString();
            if (!pseudId) {
                throw new BadRequestException(`This route requires a pseudonym ID in query parameters.`);
            }

            this.logger.log(`Checking to see if the token matches the correct format.`);
            // Checking to see if the token matches the correct format.
            // If it does, then grab the token. If not, throw an
            // Unauthorized exception.
            let bearerToken: string;
            if (jwtToken.startsWith('Bearer ')) {
                bearerToken = jwtToken.substring(7, jwtToken.length);
            } else {
                throw new UnauthorizedException(`You don't have permission to do that.`);
            }

            this.logger.log(`Verifying that the token is legitimate.`);
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

            this.logger.log(`Check to see if the account owns the pseudonym`);
            // Check to see if the account owns the pseudonym
            const account: Account = await this.accountStore.fetchAccountById(verifiedToken.sub);
            if (account.pseudonyms.some((elem) => elem._id === pseudId)) {
                if (isAllowed(account.roles, roles)) {
                    request.user = verifiedToken;
                    return true;
                } else {
                    this.logger.error(`You don't have permission to do that. Couldn't find pseud.`);
                    throw new UnauthorizedException(`You don't have permission to do that.`);
                }
            } else {
                this.logger.error(`You don't have permission to do that.`);
                throw new UnauthorizedException(`You don't have permission to do that.`);
            }
        }
    }

    return mixin(IdentityGuardMixin);
};
