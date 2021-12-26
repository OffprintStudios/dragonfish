import { Component, HostListener, OnInit } from '@angular/core';
import { ProfileRepository } from '@dragonfish/client/repository/profile';
import { isMobile } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-profile-home',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
    mobileMode = false;
    constructor(public profile: ProfileRepository) {}

    ngOnInit(): void {
        this.onResize();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
