import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/mongo/users/users.service';
import { JwtPayload } from './models';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

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
      throw new UnauthorizedException('You don\'t have permission to do that.');
    }
    
    // Verifying that the token is legitimate.
    const verifiedToken = this.jwtService.verify<JwtPayload>(bearerToken, {ignoreExpiration: true});
    if (verifiedToken.exp < new Date().getSeconds()) {
      // If the token is legitimate and active, let them pass.
      request.user = verifiedToken;
      return true;
    } else if (verifiedToken.exp > new Date().getSeconds()) {
      // Otherwise, first check to see if there's an active refresh token.
      const refreshToken = request.cookies['refreshToken'];
      if (refreshToken) {
        // If a refresh token exists, verify that it matches a valid one for the available user.s
        if (await this.usersService.checkRefreshToken(verifiedToken.sub, refreshToken)) {
          // If it matches, let's generate a new JWT and give it to the user.
          

        } else {
          throw new UnauthorizedException('You don\'t have permission to do that.');
        }
      } else {
        throw new UnauthorizedException('You don\'t have permission to do that.');
      }
    } else {
      throw new UnauthorizedException('You don\'t have permission to do that.');
    }
  }
}
