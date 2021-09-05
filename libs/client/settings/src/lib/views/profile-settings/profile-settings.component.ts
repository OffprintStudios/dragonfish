import { Component, OnInit } from '@angular/core';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PseudonymsService } from '@dragonfish/client/repository/pseudonyms/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ChangeBio, ChangeScreenName, ChangeTagline, Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';
import { AlertsService } from '@dragonfish/client/alerts';
import { CoverPicUploadComponent, UploadAvatarComponent } from '../../components';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
    changeScreenNameForm = new FormGroup({
        screenName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    });

    changeBioForm = new FormGroup({
        bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]),
    });

    taglineForm = new FormGroup({
        tagline: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    });

    constructor(
        public pseudQuery: PseudonymsQuery,
        private pseudService: PseudonymsService,
        public sessionQuery: SessionQuery,
        private router: Router,
        private alerts: AlertsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.pseudQuery.current$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeScreenNameForm.setValue({
                screenName: user.screenName,
            });

            this.changeBioForm.setValue({
                bio: user.profile.bio,
            });

            this.taglineForm.setValue({
                tagline: user.profile.tagline,
            });
        });
    }

    selectPseud(id: string) {
        this.pseudService.setActive(id);
    }

    deselectPseud() {
        this.pseudService.deselect();
    }

    changeAvatar() {
        this.dialog.open(UploadAvatarComponent);
    }

    changeCover() {
        this.dialog.open(CoverPicUploadComponent);
    }

    canSeeTaglineForm(roles: Roles[]) {
        return isAllowed(roles, [
            Roles.VIP,
            Roles.Contributor,
            Roles.Maintainer,
            Roles.Moderator,
            Roles.ChatModerator,
            Roles.Admin,
        ]);
    }

    submitScreenName() {
        if (this.changeScreenNameForm.invalid) {
            this.alerts.error(`Display names must be between 3 and 32 characters.`);
            return;
        }

        const formInfo: ChangeScreenName = {
            newScreenName: this.changeScreenNameForm.controls.screenName.value,
        };

        this.pseudService.changeScreenName(formInfo).subscribe();
    }

    submitBio() {
        if (this.changeBioForm.invalid) {
            this.alerts.error(`Bios must be between 3 and 160 characters.`);
        }

        const formInfo: ChangeBio = {
            bio: this.changeBioForm.controls.bio.value,
        };

        this.pseudService.changeBio(formInfo).subscribe();
    }

    submitTagline() {
        if (this.canSeeTaglineForm(this.sessionQuery.currAccount.roles)) {
            if (this.taglineForm.invalid) {
                this.alerts.error(`Taglines must be between 3 and 36 characters.`);
                return;
            }

            const formInfo: ChangeTagline = {
                tagline: this.taglineForm.controls.tagline.value,
            };

            this.pseudService.changeTagline(formInfo).subscribe();
        } else {
            this.alerts.info(`...how did you get here?`);
            return;
        }
    }
}
