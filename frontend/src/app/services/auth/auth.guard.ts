import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AlertsService } from 'src/app/modules/alerts';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  helper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private alertsService: AlertsService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();
    if (currentUser && currentUser.token) {
      if (this.helper.isTokenExpired(currentUser.token)) {
        this.authService.refreshToken().pipe(first()).subscribe(isValid => {
          return isValid;
        }, err => {
          this.alertsService.error(`Your session has expired! ${err}`);
          this.authService.logout();
        });
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/register'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();
    if (currentUser && currentUser.token) {
      if (this.helper.isTokenExpired(currentUser.token)) {
        this.authService.refreshToken().pipe(first()).subscribe(isValid => {
          return isValid;
        }, err => {
          this.alertsService.error(`Your session has expired! ${err}`);
          this.authService.logout();
        });
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/home'], {queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}
