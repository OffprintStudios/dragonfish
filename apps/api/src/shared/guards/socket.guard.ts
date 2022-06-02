import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '$modules/accounts/services/auth.service';
import { Roles } from '$shared/models/accounts';
import { JwtPayload } from '$shared/auth';
import { TokenExpiredError } from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketGuard implements CanActivate {
    private logger = new Logger(`SocketGuard`);

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly auth: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const roles = this.reflector.get<Roles[]>('identity', context.getHandler());

        if (!roles) {
            return false;
        }

        // Getting the JSON Web Token from the authorization header.
        const jwtToken: string = client.handshake.auth.token;

        // Getting the pseudonym query parameter
        const pseudId: string = client.handshake.auth.pseudId;
        if (!pseudId) {
            throw new BadRequestException(
                `This route requires a pseudonym ID in query parameters.`,
            );
        }

        // Verifying that the token is legitimate.
        const verifiedToken = await this.jwtService
            .verifyAsync<JwtPayload>(jwtToken, { ignoreExpiration: false })
            .catch((err) => {
                if (err instanceof TokenExpiredError) {
                    throw new WsException(`Your token has expired`);
                } else {
                    this.logger.warn(`An exception occurred verifying an auth token.`);
                    throw new WsException(`Something went wrong!`);
                }
            });

        // Check to see if the account owns the pseudonym
        if (await this.auth.verifyPseudonym(verifiedToken.sub, pseudId)) {
            if (await this.auth.checkRoles(verifiedToken.sub, ...roles)) {
                return true;
            } else {
                this.logger.error(`Someone attempted to impersonate User ${verifiedToken.sub}!`);
                throw new WsException(`You don't have permission to do that.`);
            }
        } else {
            this.logger.error(`Someone attempted to impersonate User ${verifiedToken.sub}!`);
            throw new WsException(`You don't have permission to do that.`);
        }
    }
}
