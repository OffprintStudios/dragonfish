import { Component } from '@angular/core';
import { ProfileRepository } from '@dragonfish/client/repository/profile';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { MatDialog } from '@angular/material/dialog';
import { CoverPicUploadComponent } from '@dragonfish/client/settings';

@Component({
    selector: 'dragonfish-profile-topbar',
    templateUrl: './profile-topbar.component.html',
    styleUrls: ['./profile-topbar.component.scss'],
})
export class ProfileTopbarComponent {
    isMoreOpened = false;
    loadingFollowing = false;

    constructor(
        public profile: ProfileRepository,
        public auth: AuthService,
        public session: SessionQuery,
        private alerts: AlertsService,
        private dialog: MatDialog,
    ) {}

    toggleMore() {
        this.isMoreOpened = !this.isMoreOpened;
    }

    follow() {
        this.loadingFollowing = true;
        this.profile.followUser().subscribe(() => {
            this.loadingFollowing = false;
        });
    }

    unfollow() {
        this.loadingFollowing = true;
        this.profile.unfollowUser().subscribe(() => {
            this.loadingFollowing = false;
        });
    }

    friendRequest() {
        this.alerts.info(`This feature isn't available just yet.`);
    }

    sendMessage() {
        this.alerts.info(`This feature isn't available just yet.`);
    }

    shareProfile() {
        this.alerts.info(`This feature isn't available just yet.`);
    }

    block() {
        this.alerts.info(`This feature isn't available just yet.`);
    }

    report() {
        this.alerts.info(`This feature isn't available just yet.`);
    }

    changeCover() {
        this.dialog.open(CoverPicUploadComponent, {
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
    }
}
