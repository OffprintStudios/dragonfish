import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NotificationsQuery, NotificationsService } from '@dragonfish/client/repository/notifications';
import { interval, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum MenuTabs {
    FriendsTab,
    MessagesTab,
    NotificationsTab,
    QuickOptionsTab,
}

@UntilDestroy()
@Component({
    selector: 'dragonfish-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
    tabs = MenuTabs;
    currTab = MenuTabs.QuickOptionsTab;

    constructor(
        public pseudQuery: PseudonymsQuery,
        public sessionQuery: SessionQuery,
        public notifications: NotificationsQuery,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit() {
        this.notificationsService
            .getAllUnread()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                interval(15000)
                    .pipe(
                        switchMap(() => this.notificationsService.getAllUnread()),
                        untilDestroyed(this),
                    )
                    .subscribe();
            });
    }

    switchTab(tab: MenuTabs) {
        this.currTab = tab;
    }
}
