import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Constants, Title } from '../../../shared';
import { AuthState, Auth } from '../../../shared/auth';
import { AuthService } from '../../../services/auth';
import { first } from 'rxjs/operators';
import { FrontendUser, CreateUser } from '@pulp-fiction/models/users';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;
  loadingRegister = false;
  siteVersion = Constants.siteVersion;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    inviteCode: new FormControl('', Validators.required),
    tosCheck: new FormControl(false, Validators.requiredTrue),
    ageCheck: new FormControl(false, Validators.requiredTrue),
  });

  constructor(private authService: AuthService, private store: Store, private snackBar: MatSnackBar) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.REGISTER);
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
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
      this.snackBar.open('Your passwords don\'t match!');
      return;
    }

    const credentials: CreateUser = {
      email: this.registerFields.email.value,
      username: this.registerFields.username.value,
      password: this.registerFields.password.value,
      inviteCode: this.registerFields.inviteCode.value,
      agreedToPolicies: this.registerFields.tosCheck.value
    };

    this.store.dispatch([new Auth.Register(credentials), new Navigate(['/home'])]).subscribe(() => {
      this.loadingRegister = false;
    }, err => {
      this.loadingRegister = false;
      this.snackBar.open(err.error.message);
    });
  }
}
