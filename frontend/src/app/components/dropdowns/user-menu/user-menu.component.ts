import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {
  close: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.close();
      }
    });
  }

  logout() {
    this.authService.logout();
    location.reload();
    this.close();
  }
}
