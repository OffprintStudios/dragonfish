import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertsService } from '@dragonfish/alerts';
import * as lodash from 'lodash';

import { JwtPayload } from '@dragonfish/models/auth';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    helper = new JwtHelperService();

    constructor(private alerts: AlertsService) {}

    /**
     * Verifies that a user can access a protected route. If their JWT is expired, it makes a request to the backend to
     * verify that an active session is still present. If one is, the route request is approved. If one isn't, then the
     * request is denied.
     *
     * @param next The next route requested
     * @param state Current state of the router
     */
    canActivate(next: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
        const token = localStorage.getItem('auth.token');
        const decodedToken: JwtPayload = this.helper.decodeToken(token);

        if (token) {
            if (next.data.roles) {
                const hasRoles = lodash.intersection(next.data.roles, decodedToken.roles);
                if (hasRoles.length === 0) {
                    this.alerts.error(`You don't have permission to do that.`);
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            this.alerts.error(`You don't have permission to do that.`);
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
        const token = localStorage.getItem('auth.token');
        const decodedToken: JwtPayload = this.helper.decodeToken(token);

        if (token) {
            if (next.data.roles) {
                const hasRoles = lodash.intersection(next.data.roles, decodedToken.roles);

                if (hasRoles.length === 0) {
                    this.alerts.error(`You don't have permission to do that.`);
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            this.alerts.error(`You don't have permission to do that.`);
            return false;
        }
    }
}
