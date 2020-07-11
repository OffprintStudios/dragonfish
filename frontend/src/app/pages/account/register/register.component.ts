import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/modules/alerts';
import { CreateUser, LoginUser } from 'src/app/models/users';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  currentUser: User;
  loadingRegister = false;
  loadingLogin = false;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    tosCheck: new FormControl(false, Validators.requiredTrue),
    ageCheck: new FormControl(false, Validators.requiredTrue),
  });

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
  });

  constructor(private authService: AuthService, private router: Router, private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit() {
    // this comment is here to stop linter errors
  }

  get registerFields() { return this.registerForm.controls; }
  get loginFields() { return this.loginForm.controls; }

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
    };
    this.authService.register(credentials).pipe(first()).subscribe(() => {
      this.router.navigate(['/home']);
    }, err => {
      this.loadingRegister = false;
      this.alertsService.error(err.body.message);
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loadingLogin = true;
      const credentials: LoginUser = {email: this.loginFields.email.value, password: this.loginFields.password.value};
      this.authService.login(credentials).pipe(first()).subscribe(data => {
        this.loadingLogin = false;
        console.log(data); // temporary, remove if works
        this.refreshAfterLogin();
      }, err => {
        this.loadingLogin = false;
        console.log(err.error);
      })
    }
  }

  private refreshAfterLogin(): void {
    this.router.navigate(['/home']);
  }
}
