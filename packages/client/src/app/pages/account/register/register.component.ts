import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../shared';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { AlertsService } from '../../../modules/alerts';
import { first } from 'rxjs/operators';
import { FrontendUser, CreateUser, LoginUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  currentUser: FrontendUser;
  loadingRegister = false;
  siteVersion = GlobalConstants.siteVersion;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    inviteCode: new FormControl('', Validators.required),
    tosCheck: new FormControl(false, Validators.requiredTrue),
    ageCheck: new FormControl(false, Validators.requiredTrue),
  });

  constructor(private authService: AuthService, private router: Router, 
    private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit() {
    // this comment is here to stop linter errors
  }

  get registerFields() { return this.registerForm.controls; }

  onRegisterSubmit() {
    this.loadingRegister = true;
    if (this.registerForm.invalid) {
      this.loadingRegister = false;
      return;
    }

    if (this.registerFields.password.value !== this.registerFields.repeatPassword.value) {
      this.loadingRegister = false;
      this.alertsService.warn('Your passwords don\'t match!');
      return;
    }

    const credentials: CreateUser = {
      email: this.registerFields.email.value,
      username: this.registerFields.username.value,
      password: this.registerFields.password.value,
      inviteCode: this.registerFields.inviteCode.value,
      agreedToPolicies: this.registerFields.tosCheck.value
    };
    this.authService.register(credentials).pipe(first()).subscribe(() => {
      this.loadingRegister = false;
      this.router.navigate(['/home/latest']);
    }, err => {
      this.loadingRegister = false;
      this.alertsService.error(err.error.message);
    });
  }
}
