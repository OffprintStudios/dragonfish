import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { Router } from '@angular/router';
import { Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NotificationsQuery } from '@dragonfish/client/repository/notifications';

enum MenuTabs {
    FriendsTab,
    MessagesTab,
    NotificationsTab,
}

@Component({
    selector: 'dragonfish-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
    tabs = MenuTabs;
    currTab = MenuTabs.FriendsTab;

    constructor(
        public pseudQuery: PseudonymsQuery,
        public sessionQuery: SessionQuery,
        public notifications: NotificationsQuery,
        private dialog: MatDialog,
        private auth: AuthService,
        private router: Router,
    ) {}

    switchTab(tab: MenuTabs) {
        this.currTab = tab;
    }

    logout() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to log out?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToLogOut: boolean) => {
            if (wantsToLogOut) {
                this.auth.logout().subscribe(() => {
                    this.router.navigate(['/']).catch((err) => console.log(err));
                });
            }
        });
    }

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
    }
}
