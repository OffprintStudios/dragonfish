import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as lodash from 'lodash';

import { AuthService } from './auth.service';
import { JwtPayload } from 'src/app/models/users';
import { AlertsService } from 'src/app/modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  helper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router,
    private authService: AuthService, private alertsService: AlertsService) {}

  /**
   * Verifies that a user can access a protected route. If their JWT is expired, it makes a request to the backend to
   * verify that an active session is still present. If one is, the route request is approved. If one isn't, then the
   * request is denied.
   * 
   * @param next The next route requested
   * @param state Current state of the router
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();

    if (currentUser && currentUser.token) {
      const token: JwtPayload = this.helper.decodeToken(currentUser.token);
      if (next.data.roles) {
        const hasRoles = lodash.intersection(next.data.roles, token.roles);
        
        if (hasRoles.length === 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  /**
   * Does the same thing as the above, but on any child routes that must be protected. This one is declared on
   * the route parent.
   * 
   * @param next The next route requested
   * @param state Current state of the router
   */
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();
    
    if (currentUser && currentUser.token) {
      const token: JwtPayload = this.helper.decodeToken(currentUser.token);
      if (next.data.roles) {
        const hasRoles = lodash.intersection(next.data.roles, token.roles);
        
        if (hasRoles.length === 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }
}
