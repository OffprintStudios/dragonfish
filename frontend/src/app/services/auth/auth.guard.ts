import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  helper = new JwtHelperService();

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();
    if (currentUser && currentUser.token) {
      if (this.helper.isTokenExpired(currentUser.token)) {
        this.authService.logout();
      } else {
        return true;
      }
    }
    this.router.navigate(['/register'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrUserValue();
    if (currentUser && currentUser.token) {
      if (this.helper.isTokenExpired(currentUser.token)) {
        this.authService.logout();
      } else {
        return true;
      }
    }
    this.router.navigate(['/home'], {queryParams: { returnUrl: state.url }});
    return false;
  }
}
