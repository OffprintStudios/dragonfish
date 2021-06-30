import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    constructor(public route: ActivatedRoute, public sessionQuery: SessionQuery) {}
}
