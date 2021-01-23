import { Component, OnInit } from '@angular/core';

import { MessageThread } from '@dragonfish/models/messages';
import { NetworkService } from '../../../services';

@Component({
    selector: 'sidenav-conversations',
    templateUrl: './conversations.component.html',
    styleUrls: ['./conversations.component.less'],
})
export class ConversationsComponent implements OnInit {
    loading = false;
    activeConvos: MessageThread[];

    constructor(private networkService: NetworkService) {
        this.fetchData();
    }

    ngOnInit(): void {}

    /**
     * Fetches the sidenav conversation thread list.
     */
    fetchData() {
        this.loading = true;

        this.networkService.fetchUserSidenavThreads().subscribe((threads) => {
            this.activeConvos = threads;
            this.loading = false;
        });
    }
}
