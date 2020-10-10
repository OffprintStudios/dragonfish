import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { FrontendUser } from '@pulp-fiction/models/users';
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

  get loginFields() { return this.loginForm.controls; }
}
