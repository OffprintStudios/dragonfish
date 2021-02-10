import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CreateInitialMessage } from '@dragonfish/models/messages';
import { NetworkService } from '../../../../services';
import { AlertsService } from '@dragonfish/alerts';

@Component({
    selector: 'pulp-fiction-start-conversation',
    templateUrl: './start-conversation.component.html',
    styleUrls: ['./start-conversation.component.less'],
})
export class StartConversationComponent implements OnInit {
    loading = false;

    newConversation = new FormGroup({
        subject: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        message: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    constructor(
        private networkService: NetworkService,
        private alertsService: AlertsService,
        private dialogRef: MatDialogRef<StartConversationComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) {}

    ngOnInit(): void {}

    /**
     * Getter for the new conversation form fields
     */
    get fields() {
        return this.newConversation.controls;
    }

    /**
     * Sends the message request to the backend.
     */
    submitConversation() {
        if (this.fields.subject.invalid) {
            this.alertsService.warn(`The conversation subject needs to be between 3 and 36 characters.`);
            return;
        }

        if (this.fields.message.invalid) {
            this.alertsService.warn(`Your message needs to be at least 5 characters.`);
            return;
        }

        const newMessage: CreateInitialMessage = {
            name: this.fields.subject.value,
            body: this.fields.message.value,
            recipient: this.data.userId,
        };

        this.networkService.createNewPrivateThread(newMessage).subscribe(() => {
            this.dialogRef.close();
        });
    }
}
