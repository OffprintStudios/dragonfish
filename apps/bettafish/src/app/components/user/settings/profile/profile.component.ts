import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { ChangeBio, ChangeUsername, FrontendUser } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { UserState } from '@dragonfish/client/repository/user';
import { UserService } from '@dragonfish/client/repository/user/services';
import { MatDialog } from '@angular/material/dialog';
import { UploadAvatarComponent } from '../upload-avatar/upload-avatar.component';

@UntilDestroy()
@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    changeUsernameForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        currPassword: new FormControl('', [Validators.required]),
    });

    changeBioForm = new FormGroup({
        bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]),
    });

    constructor(private user: UserService, private alerts: AlertsService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeUsernameForm.setValue({
                username: user.username,
                currPassword: '',
            });

            this.changeBioForm.setValue({
                bio: user.profile.bio,
            });
        });
    }

    get changeUsernameFields() { return this.changeUsernameForm.controls; }
    get changeBioFields() { return this.changeBioForm.controls; }

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

        return this.user.changeUsername(changeRequest);
    }

    submitBioForm() {
        if (this.changeBioFields.bio.invalid) {
            this.alerts.warn(`Bios must be between 3 and 160 characters.`);
            return;
        }
        const changeRequest: ChangeBio = {
            bio: this.changeBioFields.bio.value,
        };

        return this.user.changeBio(changeRequest);
    }
}
