import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as lodash from 'lodash';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../shared/user';

import { FrontendUser, Roles } from '@dragonfish/models/users';

import { Title } from '../../shared';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  portUser: FrontendUser; // The user whose portfolio this is
  portUserId: string; // Their ID, fetched from the route parameters

  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  constructor(public route: ActivatedRoute, public dialog: MatDialog) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.portUser = data.portData as FrontendUser;
    });
    Title.setTwoPartTitle(this.portUser.username);
  }

  /**
   * Checks to see if the currently logged in user is the same as the user who owns this portfolio.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.portUser) {
        if (this.currentUser._id === this.portUser._id) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  /**
   * Checks to see what the prominent role for this user is so it can be displayed.
   * 
   * @param roles The roles to check
   */
  determineProminentRole(roles: Roles[]) {
    // this will totally need retooling to figure out a much better way to verify what the top-level
    // role is
    const hasAdmin = lodash.intersection([Roles.Admin], roles);
    const hasModerator = lodash.intersection([Roles.Moderator], roles);
    const hasChatModerator = lodash.intersection([Roles.ChatModerator], roles);
    const hasContributor = lodash.intersection([Roles.Contributor], roles);
    const hasWorkApprover = lodash.intersection([Roles.WorkApprover], roles);
    const hasVIP = lodash.intersection([Roles.VIP], roles);
    const hasSupporter = lodash.intersection([Roles.Supporter], roles);

    if (hasAdmin.length > 0) {
      return Roles.Admin;
    } else if (hasModerator.length > 0) {
      return Roles.Moderator;
    } else if (hasChatModerator.length > 0) {
      return Roles.ChatModerator;
    } else if (hasContributor.length > 0) {
      return Roles.Contributor;
    } else if (hasWorkApprover.length > 0) {
      return Roles.WorkApprover;
    } else if (hasVIP.length > 0) {
      return Roles.VIP;
    } else if (hasSupporter.length > 0) {
      return Roles.Supporter;
    } else {
      return Roles.User;
    }
  }


  /**
   * Opens the new message dialog
   */
  /*startNewConversation() {
    if (this.portUserId) {
      this.dialog.open(StartConversationComponent, {data: {userId: this.portUserId}});
    }
  }*/
}
