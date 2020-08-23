import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Toppy, ToppyControl, RelativePosition, OutsidePlacement } from 'toppy';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from './services/auth';
import { slogans, Theme } from './models/site';
import { UserMenuComponent } from './components/dropdowns';
import { PredefinedThemes } from './models/site/theme';
import { StatsService } from './services/admin';
import { FrontPageStats } from '@pulp-fiction/models/stats';
import { NagBarService } from './modules/nag-bar';
import { NewPolicyNagComponent } from './components/new-policy-nag/new-policy-nag.component';

@Component({
  selector: 'pulp-fiction-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('userMenu', {static: false}) userMenu: ElementRef;

  title = 'offprint';
  currentUser: FrontendUser;
  userMenuDropdown: ToppyControl;

  loading = false;
  footerStats: FrontPageStats;
  rotatingSlogan: string;

  constructor(private router: Router, private toppy: Toppy, private authService: AuthService,
    private selectConfig: NgSelectConfig, private statsService: StatsService,
    private nagBarService: NagBarService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    this.fetchFrontPageStats();

    // Sets the current site theme based on user preference
    if (this.currentUser) {
        this.changeTheme(PredefinedThemes[this.currentUser.profile.themePref]);     
    }

    this.rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
  }

  /**
   * Every time a new page is navigated to, the scroll position is reset to the top of the page.
   */
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    });
  }  

  /**
   * Initializes the global dropdown menus.
   */
  ngAfterViewInit() {
    this.userMenuDropdown = this.toppy
      .position(new RelativePosition({src: this.userMenu.nativeElement, width: 'auto', placement: OutsidePlacement.BOTTOM_LEFT}))
      .config({closeOnDocClick: true, closeOnEsc: true})
      .content(UserMenuComponent)
      .create();

      // Initialize the ToS nagbar if we need to
      if (!this.currentUser) {
        this.authService.currUser.subscribe(x => {
        // This is wrapped in setTimeout because it's called by ngAfterInit,
        // and if we modify the UI before that finishes, Angular errors out.
        // So allow one render tick to progress before we try.
          setTimeout(() => {
            this.checkUserPolicies(x);
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
   * Opens the user menu dropdown.
   */
  openUserMenu() {
    this.userMenuDropdown.open();
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

  private checkUserPolicies(user: FrontendUser) {
    if (!user.agreedToPolicies) {
      this.nagBarService.queueContent(NewPolicyNagComponent, null);
    }     
  }
}
