import { Component, OnInit } from '@angular/core';

import { MessageThread } from '@dragonfish/models/messages';
import { MessagesService } from '../../../services/content';

@Component({
    selector: 'sidenav-conversations',
    templateUrl: './conversations.component.html',
    styleUrls: ['./conversations.component.less'],
})
export class ConversationsComponent implements OnInit {
    loading = false;
    activeConvos: MessageThread[];

    constructor(private messageService: MessagesService) {
        this.fetchData();
    }

    ngOnInit(): void {}

    /**
     * Fetches the sidenav conversation thread list.
     */
    fetchData() {
        this.loading = true;

        this.messageService.fetchUserSidenavThreads().subscribe((threads) => {
            this.activeConvos = threads;
            this.loading = false;
        });
    }
}
