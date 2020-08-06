import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Toppy, ToppyControl, RelativePosition, OutsidePlacement } from 'toppy';

import { User } from './models/users';
import { AuthService } from './services/auth';
import { slogans, Theme } from './models/site';
import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';
import { DarkCrimson, Aqua, DarkAqua, Royal, DarkRoyal, Steel, MidnightField, Autumn, DuskAutumn, PredefinedThemes } from './models/site/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('userMenu', {static: false}) userMenu: ElementRef;
  @ViewChild('searchMenu', {static: false}) searchMenu: ElementRef;  

  title = 'offprint';
  currentUser: User;
  userMenuDropdown: ToppyControl;
  searchMenuDropdown: ToppyControl;

  rotatingSlogan: string;

  constructor(private router: Router, private toppy: Toppy, private authService: AuthService, private selectConfig: NgSelectConfig) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

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
    })
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
    
    this.searchMenuDropdown = this.toppy
      .position(new RelativePosition({src: this.searchMenu.nativeElement, width: 'auto', placement: OutsidePlacement.BOTTOM_RIGHT}))
      .config({closeOnDocClick: true, closeOnEsc: true})
      .content(SearchMenuComponent)
      .create();
  }

  /**
   * Opens the user menu dropdown.
   */
  openUserMenu() {
    this.userMenuDropdown.open();
  }

  /**
   * Opens the search menu dropdown.
   */
  openSearchMenu() {
    this.searchMenuDropdown.open();
  }

  /**
   * Changes the site's theme based on user preference by manipulating CSS variables declared
   * in styles.less.
   * @param(newTheme) The theme to change to.
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
}
