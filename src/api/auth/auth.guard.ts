import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { UsersService } from '../../db/users/users.service';
import { AuthService } from './auth.service';
import { JwtPayload } from './models';
import { isNullOrUndefined } from 'util';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService, private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const passportResponse = await (super.canActivate(context)) as boolean;
    if (passportResponse) {
      return passportResponse;
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const potRefreshToken = req.cookie['refreshToken'];
    const token = req.headers['Authorization'];
    const decodedToken: any = this.jwtService.decode(token);
    const thisSession = await this.usersService.fetchUserRefreshToken(decodedToken.userId, potRefreshToken);

    if (isNullOrUndefined(thisSession)) {
      return false;
    }

    const newFrontendUser = await this.authService.getNewToken(req.body);
    req.headers['Authorization'] = `Bearer ${newFrontendUser.token}`;
    res.body = newFrontendUser;
    return (await super.canActivate(context)) as boolean;
  }
}
