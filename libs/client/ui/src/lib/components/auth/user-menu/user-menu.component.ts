import { Component, HostListener } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NotificationsRepository } from '@dragonfish/client/repository/notifications';
import { isMobile } from '@dragonfish/shared/functions';

enum MenuTabs {
    FriendsTab,
    MessagesTab,
    NotificationsTab,
    QuickOptionsTab,
}

@Component({
    selector: 'dragonfish-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
    tabs = MenuTabs;
    currTab = MenuTabs.QuickOptionsTab;
    mobileMode = false;

    constructor(
        public pseudQuery: PseudonymsQuery,
        public sessionQuery: SessionQuery,
        public notifications: NotificationsRepository,
    ) {
        this.onResize();
    }

    switchTab(tab: MenuTabs) {
        this.currTab = tab;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
