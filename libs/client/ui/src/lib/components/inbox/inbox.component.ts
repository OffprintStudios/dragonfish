import { Component } from '@angular/core';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

enum InboxTabs {
    Messages,
    Notifications,
}

@Component({
    selector: 'dragonfish-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
    inboxTabs = InboxTabs;
    selectedTab = InboxTabs.Messages;

    constructor(public pseudQuery: PseudonymsQuery) {}

    switchTab = (newTab: InboxTabs) => {
        this.selectedTab = newTab;
    };
}
