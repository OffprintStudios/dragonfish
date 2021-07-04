import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

enum RegistrationTabs {
    LogIn,
    Register,
}

@Component({
    selector: 'dragonfish-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
    registrationTabs = RegistrationTabs;
    selectedTab = RegistrationTabs.LogIn;

    constructor(private router: Router, private location: Location) {}

    switchTab(newTab: RegistrationTabs) {
        this.selectedTab = newTab;
    }

    isSuccess(event: boolean) {
        if (event) {
            this.router.navigate(['/']).catch((err) => {
                console.log(err);
            });
        }
    }

    goBack() {
        this.location.back();
    }
}
