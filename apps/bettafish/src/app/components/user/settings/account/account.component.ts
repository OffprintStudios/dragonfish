import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeEmail, ChangePassword, FrontendUser } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { UserState } from '@dragonfish/client/repository/user';
import { UserService } from '@dragonfish/client/repository/user/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    changeEmailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        currPassword: new FormControl('', [Validators.required]),
    });

    changePasswordForm = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        repeatNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        currPassword: new FormControl('', [Validators.required]),
    });

    constructor(private user: UserService, private alerts: AlertsService) {}

    ngOnInit(): void {
        this.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeEmailForm.setValue({
                email: user.email,
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

        return this.user.changeEmail(changeRequest);
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

        return this.user.changePassword(changeRequest);
    }
}
