import { CanActivate, ExecutionContext, UnauthorizedException, mixin, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import * as lodash from 'lodash';

import { Roles } from '@pulp-fiction/models/users';
import { UsersService } from '../db/users/users.service';
import { JwtPayload } from '@pulp-fiction/models/auth';

/**
 * This is a mixin so we can do stuff like UseGuards(RolesGuard(['Admin','Moderator'])).
 * 
 * @param roles The roles required to activate the associated route
 */
export const RolesGuard = (requiredRoles: Roles[]) => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
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
      let verifiedToken: JwtPayload; 
      try {
        verifiedToken = this.jwtService.verify<JwtPayload>(bearerToken, {ignoreExpiration: false});
      } catch(err) {
        if (err instanceof TokenExpiredError) {
          throw new UnauthorizedException("Your token has expired.");
        } else {
          throw err;
        }
      }

      if (verifiedToken) {
        const userRoles = await this.usersService.fetchRoles(verifiedToken.sub);
        const hasRoles = lodash.intersection(userRoles, requiredRoles);

        if (hasRoles.length !== 0) {
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

  const guard = mixin(RolesGuardMixin);
  return guard;
}
