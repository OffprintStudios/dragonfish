import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as lodash from 'lodash';

import { FrontendUser, LoginUser, Roles } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';
import { AlertsService } from '../../modules/alerts';

@Component({
  selector: 'site-sidenav',
  templateUrl: './site-sidenav.component.html',
  styleUrls: ['./site-sidenav.component.less']
})
export class SiteSidenavComponent implements OnInit {
  currentUser: FrontendUser;

  loadingLogin = false;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
  });

  constructor(private authService: AuthService, private alertsService: AlertsService, private router: Router) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }

  /**
   * Login form field getter.
   */
  get loginFields() { return this.loginForm.controls; }

  /**
   * Submits the login form to the backend.
   */
  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loadingLogin = true;
      const credentials: LoginUser = {
        email: this.loginFields.email.value, 
        password: this.loginFields.password.value, 
        rememberMe: this.loginFields.rememberMe.value
      };
      this.authService.login(credentials).pipe(first()).subscribe(() => {
        this.loadingLogin = false;
        this.router.navigate(['/home/latest']);
      }, err => {
        this.loadingLogin = false;
        this.alertsService.error(err.error.message);
      })
    }
  }

  /**
   * In order to access the contributor page
   */
  checkUserRolesForContribMenu() {
    if (this.currentUser) {
      const allowedRoles = [Roles.Admin, Roles.Moderator, Roles.Contributor, Roles.WorkApprover];
      const hasRoles = lodash.intersection(allowedRoles, this.currentUser.roles);

      if (hasRoles.length === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * Calls the logout method from AuthService.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/home/latest']).then(() => {
      location.reload();
    });
  }

}
