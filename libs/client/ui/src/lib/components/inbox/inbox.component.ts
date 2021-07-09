import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';

enum InboxTabs {
    Messages,
    Notifications,
}

@Component({
    selector: 'dragonfish-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
    inboxTabs = InboxTabs;
    selectedTab = InboxTabs.Messages;

    constructor(public sessionQuery: SessionQuery) {}

    switchTab = (newTab: InboxTabs) => { this.selectedTab = newTab };
}
