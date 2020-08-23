import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, NavigationStart } from '@angular/router';
import * as lodash from 'lodash';

import { Roles, FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {
  close: any;
  currentUser: FrontendUser;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.close();
      }
    });
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

  /**
   * Calls the logout method from AuthService.
   */
  logout() {
    this.authService.logout();
    this.close();
  }
}
