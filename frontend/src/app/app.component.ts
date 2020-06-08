import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor(private router: Router, private toppy: Toppy, private authService: AuthService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    // Add theming at some point
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      } else {
        window.scrollTo(0,0);
      }
    })
  }

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

  openUserMenu() {
    this.userMenuDropdown.open();
  }

  openSearchMenu() {
    this.searchMenuDropdown.open();
  }
}
