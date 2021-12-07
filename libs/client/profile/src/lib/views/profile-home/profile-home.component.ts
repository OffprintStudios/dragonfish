import { Component, OnInit } from '@angular/core';
import { ProfileRepository } from '@dragonfish/client/repository/profile';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent implements OnInit {
    constructor(public profile: ProfileRepository) {}

    ngOnInit(): void {
        setThreePartTitle(this.profile.screenName, Constants.PROFILE);
    }
}
