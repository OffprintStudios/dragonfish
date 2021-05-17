import { Component } from '@angular/core';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from '../../../services';
import { SessionQuery } from '@dragonfish/client/repository/session';

enum UserTabs {
    Friends,
    Notifications,
    History,
}

@Component({
    selector: 'dragonfish-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
    moreMenuOpened = false;
    userTabs = UserTabs;
    selectedTab = UserTabs.Notifications;

    constructor(
        private auth: AuthService,
        private dialog: MatDialog,
        private sidenavService: SidenavService,
        public sessionQuery: SessionQuery,
    ) {}

    toggleMoreMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    switchUserTab(newTab: UserTabs) {
        this.selectedTab = newTab;
    }

    logout() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to log out?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToLogOut: boolean) => {
            if (wantsToLogOut) {
                this.auth.logout();
                this.sidenavService.close();
            }
        });
    }
}
