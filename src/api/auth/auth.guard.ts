import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { UsersService } from '../../db/users/users.service';
import { AuthService } from './auth.service';
import { JwtPayload } from './models';

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
    const token = req.headers['Authorization'];
    const decodedToken = this.jwtService.decode(token);
    //const thisSession = this.usersService.fetchUserRefreshToken(decodedToken.sub);
    console.log(decodedToken);
    return (await super.canActivate(context)) as boolean;
  }
}
