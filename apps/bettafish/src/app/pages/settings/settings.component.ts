import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    constructor(public sessionQuery: SessionQuery) {}
}
