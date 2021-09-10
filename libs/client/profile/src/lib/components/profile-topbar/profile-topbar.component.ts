import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProfileQuery } from '../../repo';

@Component({
    selector: 'dragonfish-profile-topbar',
    templateUrl: './profile-topbar.component.html',
    styleUrls: ['./profile-topbar.component.scss'],
})
export class ProfileTopbarComponent {
    isMoreOpened = false;

    constructor(public profileQuery: ProfileQuery) {}

    toggleMore() {
        this.isMoreOpened = !this.isMoreOpened;
    }
}
