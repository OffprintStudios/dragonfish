import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { FrontendUser, LoginUser } from '@pulp-fiction/models/users';
import { AuthService } from './services/auth';

@Component({
  selector: 'dashboard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'Offprint Dashboard';

  currentUser: FrontendUser;
  loadingLogin = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false)
  });

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  /**
   * Login form field getter.
   */
  get loginFields() { return this.loginForm.controls; }

  /**
   * Logs a user in
   */
  submitLogin() {
    this.loadingLogin = true;
    const credentials: LoginUser = {
      email: this.loginFields.email.value,
      password: this.loginFields.password.value,
      rememberMe: this.loginFields.rememberMe.value
    };

    this.authService.login(credentials).subscribe(() => {
      this.loadingLogin = false;
      this.loginForm.reset();
    }, () => {
      this.loadingLogin = false;
    });
  }

  /**
   * Logs a user out.
   */
  logOut() {
    this.authService.logout();
  }
}
