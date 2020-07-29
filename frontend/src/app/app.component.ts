import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Toppy, ToppyControl, RelativePosition, OutsidePlacement } from 'toppy';

import { User } from './models/users';
import { AuthService } from './services/auth';
import { UserMenuComponent, SearchMenuComponent } from './components/dropdowns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('userMenu', {static: false}) userMenu: ElementRef;
  @ViewChild('searchMenu', {static: false}) searchMenu: ElementRef;  

  title = 'frontend';
  currentUser: User;
  userMenuDropdown: ToppyControl;
  searchMenuDropdown: ToppyControl;

  constructor(private router: Router, private toppy: Toppy, private authService: AuthService, private selectConfig: NgSelectConfig) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    // Sets the current site theme based on user preference
    if (this.currentUser) {
      if (this.currentUser.profile.themePref === 'dark-crimson') {
        this.changeTheme('#DD4C4F', '#933235', 'rgb(39,39,39)', 'whitesmoke', 'white', 'rgb(58,58,58)', 'rgb(58,58,58)')
      } else if (this.currentUser.profile.themePref === 'aqua') {
        this.changeTheme('rgb(80,152,214)', 'rgb(49,99,153)', '#fbfbfb', 'black', 'grey', 'lightgrey', '#f0f0f0');
      } else if (this.currentUser.profile.themePref === 'dark-aqua') {
        this.changeTheme('rgb(80,152,214)', 'rgb(49,99,153)', 'rgb(39,39,39)', 'whitesmoke', 'white', 'rgb(58,58,58)', 'rgb(58,58,58)')
      } else if (this.currentUser.profile.themePref === 'royal') {
        this.changeTheme('#9A4EAE', '#4E2A84', '#fbfbfb', 'black', 'grey', 'lightgrey', '#f0f0f0');
      } else if (this.currentUser.profile.themePref === 'dark-royal') {
        this.changeTheme('#9A4EAE', '#4E2A84', 'rgb(39,39,39)', 'whitesmoke', 'white', 'rgb(58,58,58)', 'rgb(58,58,58)');
      } else if (this.currentUser.profile.themePref === 'steel') {
        this.changeTheme('rgb(59,63,68)', 'rgb(60,128,40)', '#fbfbfb', 'black', 'grey', 'lightgrey', '#f0f0f0');
      } else if (this.currentUser.profile.themePref === 'midnight-field') {
        this.changeTheme('rgb(60,128,40)', 'rgb(59,63,68)', 'rgb(39,39,39)', 'whitesmoke', 'white', 'rgb(58,58,58)', 'rgb(58,58,58)')
      } else if (this.currentUser.profile.themePref === 'autumn') {
        this.changeTheme('rgb(209,109,43)', 'rgb(172,71,49)', '#fbfbfb', 'black', 'grey', 'lightgrey', '#f0f0f0');
      } else if (this.currentUser.profile.themePref === 'dusk-autumn') {
        this.changeTheme('rgb(209,109,43)', 'rgb(172,71,49)', 'rgb(39,39,39)', 'whitesmoke', 'white', 'rgb(58,58,58)', 'rgb(58,58,58)')
      }
    }

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
   * 
   * @param accent The site accent
   * @param accentHover The hover color for buttons and links
   * @param background The background color
   * @param textColor The text color
   * @param borders The border color for divs and containers
   * @param controls The background color for any control bars
   * @param code The background color for code blocks
   */
  changeTheme(accent: string, accentHover: string, background: string, textColor: string, borders: string, controls: string, code: string){
    document.documentElement.style.setProperty('--site-accent', accent);
    document.documentElement.style.setProperty('--site-accent-hover', accentHover);
    document.documentElement.style.setProperty('--site-background', background);
    document.documentElement.style.setProperty('--site-text-color', textColor);
    document.documentElement.style.setProperty('--site-borders', borders);
    document.documentElement.style.setProperty('--site-controls-background', controls);
    document.documentElement.style.setProperty('--site-code-background', code);
  }
}
