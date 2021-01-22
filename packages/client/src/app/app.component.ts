import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as lodash from 'lodash';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Select } from '@ngxs/store';
import { UserState } from './shared/user';

import { FrontendUser, Roles, PredefinedThemes } from '@pulp-fiction/models/users';
import { spookySlogans, slogans, Theme } from './models/site';
import { StatsService } from './services/admin';
import { FrontPageStats } from '@pulp-fiction/models/stats';
import { NagBarService } from './modules/nag-bar';
import { NewPolicyNagComponent } from './components/new-policy-nag/new-policy-nag.component';
import { NotificationsService } from './services/user';
import { NotificationBase } from '@pulp-fiction/models/notifications';
import { Constants } from './shared';

@Component({
  selector: 'pulp-fiction-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav', {static: true}) sidenav: ElementRef;

  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  sidenavOpened: boolean;

  title = 'offprint';

  loading = false;
  loadingLogin = false;
  footerStats: FrontPageStats;
  rotatingSlogan: string;

  notifications: NotificationBase[];
  numNotifs: number = 0;

  constructor(private router: Router, private statsService: StatsService,
    private nagBarService: NagBarService, public loader: LoadingBarService, private notif: NotificationsService) {

    this.fetchFrontPageStats();

    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    
    if (this.currentUser) {
        // Sets the current site theme based on user preference
        this.changeTheme(PredefinedThemes[this.currentUser.profile.themePref]);   

        // Starts fetching notifications updates from the server
        interval(Constants.FIVE_MINUTES).pipe(flatMap(() => this.notif.getUnreadNotifications())).subscribe(data => {
          this.notifications = data;
          this.numNotifs = this.notifications.length;
        });  
    }

    this.rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
  }
  
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      this.sidenavOpened = false;
      if (event instanceof NavigationEnd) {
        this.rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
      }
    });
  }

  /**
   * Initializes the global dropdown menus.
   */
  ngAfterViewInit(): void {
      // Initialize the ToS nagbar if we need to
      if (!this.currentUser) {
        this.currentUser$.subscribe(x => {
        // This is wrapped in setTimeout because it's called by ngAfterInit,
        // and if we modify the UI before that finishes, Angular errors out.
        // So allow one render tick to progress before we try.
          setTimeout(() => {
            if (x !== null) {
              this.checkUserPolicies(x);
            }
          });
        })
      } else {
        // See above comment re: setTimeout()
        setTimeout(() => {
            this.checkUserPolicies(this.currentUser);
        });
      }
  }

  /**
   * Unsubscribes from everything.
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  /**
   * Fetches the front page stats.
   */
  private fetchFrontPageStats() {
    this.loading = true;
    this.statsService.fetchFrontPageStats().subscribe(stats => {
      this.footerStats = stats;
      this.loading = false;
    });
  }

  /**
   * Changes the site's theme based on user preference by manipulating CSS variables declared
   * in styles.less.
   * @param newTheme The theme to change to.
   */
  changeTheme(newTheme: Theme){
    document.documentElement.style.setProperty('--site-accent', newTheme.accent);
    document.documentElement.style.setProperty('--site-accent-hover', newTheme.accentHover);
    document.documentElement.style.setProperty('--site-accent-light', newTheme.accentLight);
    document.documentElement.style.setProperty('--site-background', newTheme.background);
    document.documentElement.style.setProperty('--site-text-color', newTheme.textColor);
    document.documentElement.style.setProperty('--site-borders', newTheme.borders);
    document.documentElement.style.setProperty('--site-controls-background', newTheme.controlsBackground);
    document.documentElement.style.setProperty('--site-code-background', newTheme.codeBackground);
  }

  /**
   * Checks to see if the currently logged-in user has agreed to the site's policies.
   * 
   * @param user The currently logged-in user
   */
  private checkUserPolicies(user: FrontendUser) {
    if (!user.agreedToPolicies) {
      this.nagBarService.queueContent(NewPolicyNagComponent, null);
    }     
  }

  /**
   * Closes the sidenav if the close button was clicked.
   * 
   * @param event Check for the close button click
   */
  onCloseClicked(event: boolean) {
    if (event === true) {
      this.sidenavOpened = false;
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
}
