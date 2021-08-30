import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

@Component({
    selector: 'dragonfish-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    constructor(public sessionQuery: SessionQuery, public pseudQuery: PseudonymsQuery) {}
}
