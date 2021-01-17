import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { first } from 'rxjs/operators';
import { Constants } from '../../shared';

import { FrontendUser, LoginUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';
import { AlertsService } from '../../modules/alerts';
import { ConversationsComponent } from './conversations/conversations.component';
import { HistoryComponent } from './history/history.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { WatchingComponent } from './watching/watching.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'site-sidenav',
  templateUrl: './site-sidenav.component.html',
  styleUrls: ['./site-sidenav.component.less']
})
export class SiteSidenavComponent implements OnInit {
  @ViewChild(ConversationsComponent) private convoComponent: ConversationsComponent;
  @ViewChild(HistoryComponent) private histComponent: HistoryComponent;
  @ViewChild(NotificationsComponent) private notifComponent: NotificationsComponent;
  @ViewChild(WatchingComponent) private watchingComponent: WatchingComponent;

  @Output() closeSidenav = new EventEmitter<boolean>();

  currentUser: FrontendUser;
  loadingLogin = false;
  siteVersion = Constants.siteVersion;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });

  constructor(private authService: AuthService, private alertsService: AlertsService, private router: Router, private snackBar: MatSnackBar) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.convoComponent.fetchData();
    } else if (event.index === 1) {
      // do something for watching
    } else if (event.index === 2) {
      this.histComponent.fetchData();
    } else if (event.index === 3) {
      this.notifComponent.fetchData();
    }
  }

  /**
   * Login form field getter.
   */
  get loginFields() { return this.loginForm.controls; }

  /**
   * Submits the login form to the backend.
   */
  onLoginSubmit() {
    if (this.loginFields.email.value === null || this.loginFields.email.value === undefined) {
      this.snackBar.open(`You must enter your email.`);
      return;
    }

    if (this.loginFields.password.value === null || this.loginFields.password.value === undefined || this.loginFields.password.value === '') {
      this.snackBar.open(`You must enter your password.`);
      return;
    }

    this.loadingLogin = true;
    const credentials: LoginUser = {
      email: this.loginFields.email.value, 
      password: this.loginFields.password.value, 
      rememberMe: this.loginFields.rememberMe.value
    };
    this.authService.login(credentials).pipe(first()).subscribe(() => {
      this.loadingLogin = false;
      this.router.navigate(['/home']);
    }, err => {
      this.loadingLogin = false;
      this.snackBar.open(err.error.message);
    })
  }

  /**
   * Emits whether or not a user wants to close the sidenav
   */
  onCloseClicked() {
    this.closeSidenav.emit(true);
  }

  /**
   * Calls the logout method from AuthService.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']).then(() => {
      location.reload();
    });
  }

}
