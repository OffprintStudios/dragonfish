import { Component } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
    ngOnInit() {
        setTwoPartTitle(Constants.MESSAGES);
    }
}
