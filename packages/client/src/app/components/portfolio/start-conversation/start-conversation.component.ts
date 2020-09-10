import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { CreateInitialMessage } from '@pulp-fiction/models/messages';
import { MessagesService } from '../../../services/content';
import { AlertsService } from '../../../modules/alerts';

@Component({
  selector: 'pulp-fiction-start-conversation',
  templateUrl: './start-conversation.component.html',
  styleUrls: ['./start-conversation.component.less']
})
export class StartConversationComponent implements OnInit {
  loading = false;

  newConversation = new FormGroup({
    subject: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    message: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  constructor(private messageService: MessagesService, private alertsService: AlertsService,
    private dialogRef: MatDialogRef<StartConversationComponent>) { }

  ngOnInit(): void {
  }

  /**
   * Getter for the new conversation form fields
   */
  get fields() { return this.newConversation.controls; }

  submitConversation() {
    console.log(this.fields);
  }
}
