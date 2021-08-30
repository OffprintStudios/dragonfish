import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangeBio, ChangeUsername } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from '@dragonfish/client/repository/session/services';
import { MatDialog } from '@angular/material/dialog';
import { UploadAvatarComponent } from '../upload-avatar/upload-avatar.component';
import { SessionQuery } from '@dragonfish/client/repository/session';

@UntilDestroy()
@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    changeUsernameForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        currPassword: new FormControl('', [Validators.required]),
    });

    changeBioForm = new FormGroup({
        bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]),
    });

    constructor(
        private user: UserService,
        private alerts: AlertsService,
        private dialog: MatDialog,
        public sessionQuery: SessionQuery,
    ) {}

    ngOnInit(): void {
        this.sessionQuery.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeUsernameForm.setValue({
                username: user.username,
                currPassword: '',
            });

            this.changeBioForm.setValue({
                bio: user.profile.bio,
            });
        });
    }

    get changeUsernameFields() {
        return this.changeUsernameForm.controls;
    }
    get changeBioFields() {
        return this.changeBioForm.controls;
    }

    changeAvatar() {
        this.dialog.open(UploadAvatarComponent);
    }

    submitUsernameForm() {
        if (this.changeUsernameFields.username.invalid) {
            this.alerts.warn(`Usernames must be between 3 and 36 characters.`);
            return;
        }
        const changeRequest: ChangeUsername = {
            newUsername: this.changeUsernameFields.username.value,
            currentPassword: this.changeUsernameFields.currPassword.value,
        };

        this.alerts.info(`This feature has been temporarily disabled.`);
        //return this.user.changeUsername(changeRequest);
    }

    submitBioForm() {
        if (this.changeBioFields.bio.invalid) {
            this.alerts.warn(`Bios must be between 3 and 160 characters.`);
            return;
        }
        const changeRequest: ChangeBio = {
            bio: this.changeBioFields.bio.value,
        };

        this.alerts.info(`This feature has been temporarily disabled.`);
        //return this.user.changeBio(changeRequest).subscribe();
    }
}
