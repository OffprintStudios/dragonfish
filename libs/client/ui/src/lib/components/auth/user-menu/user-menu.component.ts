import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NotificationsQuery } from '@dragonfish/client/repository/notifications';

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

    constructor(
        public pseudQuery: PseudonymsQuery,
        public sessionQuery: SessionQuery,
        public notifications: NotificationsQuery,
    ) {}

    switchTab(tab: MenuTabs) {
        this.currTab = tab;
    }
}
