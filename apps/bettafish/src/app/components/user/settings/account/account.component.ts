import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeEmail, ChangePassword } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { UserService } from '@dragonfish/client/repository/session/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
    changeEmailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        currPassword: new FormControl('', [Validators.required]),
    });

    changePasswordForm = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        repeatNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        currPassword: new FormControl('', [Validators.required]),
    });

    constructor(private user: UserService, private alerts: AlertsService, public sessionQuery: SessionQuery) {}

    ngOnInit(): void {
        this.sessionQuery.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeEmailForm.patchValue({
                email: '',
                currPassword: '',
            });
            this.changePasswordForm.setValue({
                newPassword: '',
                repeatNewPassword: '',
                currPassword: '',
            });
        });
    }

    get changeEmailFields() {
        return this.changeEmailForm.controls;
    }

    get changePasswordFields() {
        return this.changePasswordForm.controls;
    }

    submitEmailForm() {
        if (this.changeEmailFields.email.invalid) {
            this.alerts.error(`You need to submit a valid email address.`);
            return;
        }
        const changeRequest: ChangeEmail = {
            currentPassword: this.changeEmailFields.currPassword.value,
            newEmail: this.changeEmailFields.email.value,
        };

        this.alerts.info(`This feature has been temporarily disabled.`);
        //return this.user.changeEmail(changeRequest).subscribe();
    }

    submitPasswordForm() {
        if (this.changePasswordFields.newPassword.value === this.changePasswordFields.currPassword.value) {
            this.alerts.error(`Your new password must be different from your current one.`);
            return;
        }
        if (this.changePasswordFields.newPassword.value !== this.changePasswordFields.repeatNewPassword.value) {
            this.alerts.error(`The repeated password doesn't match the new one.`);
            return;
        }
        const changeRequest: ChangePassword = {
            newPassword: this.changePasswordFields.newPassword.value,
            currentPassword: this.changePasswordFields.currPassword.value,
        };

        this.alerts.info(`This feature has been temporarily disabled.`);
        //return this.user.changePassword(changeRequest).subscribe();
    }
}
