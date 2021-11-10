import { Component } from '@angular/core';
import { ProfileRepository } from '@dragonfish/client/repository/profile';

@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent {
    constructor(public profile: ProfileRepository) {}
}
