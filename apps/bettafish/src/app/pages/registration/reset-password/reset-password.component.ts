import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { ResetPassword } from '@dragonfish/shared/models/accounts';

@UntilDestroy()
@Component({
    selector: 'dragonfish-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    creatingNewPassword = false;
    userId: string;
    token: string;
    loadingRequest = false;

    accountEmail = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    changePassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        repeatPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private network: DragonfishNetworkService,
        private route: ActivatedRoute,
        private alerts: AlertsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.pipe(untilDestroyed(this)).subscribe((params) => {
            if (params.has('userId') && params.has('token')) {
                this.creatingNewPassword = true;
                this.userId = params.get('userId');
                this.token = params.get('token');
            } else {
                this.creatingNewPassword = false;
            }
        });
    }

    submitEmail() {
        this.loadingRequest = true;

        if (this.accountEmail.controls.email.invalid) {
            this.alerts.error(`You must submit a valid email.`);
            this.loadingRequest = false;
            return;
        }

        this.network.sendResetPasswordRequest(this.accountEmail.controls.email.value).subscribe(() => {
            this.alerts.success(`We've got your request!`);
            this.loadingRequest = false;
        });
    }

    submitNewPassword() {
        this.loadingRequest = true;
        if (this.passwordFields.newPassword.invalid || this.passwordFields.repeatPassword.invalid) {
            this.alerts.error(`Your password must be at least 3 characters long.`);
            this.loadingRequest = false;
            return;
        }

        if (this.passwordFields.newPassword.value !== this.passwordFields.repeatPassword.value) {
            this.alerts.error(`Your passwords don't match!`);
            this.loadingRequest = false;
            return;
        }

        const resetForm: ResetPassword = {
            accountId: this.userId,
            resetCode: this.token,
            newPassword: this.passwordFields.repeatPassword.value,
        };

        this.network.resetPassword(resetForm).subscribe(() => {
            this.alerts.success(`Your password has been successfully reset. Go ahead and log back in!`);
            this.loadingRequest = false;
            this.router.navigate(['/registration']).catch((err) => console.log(err));
        });
    }

    private get passwordFields() {
        return this.changePassword.controls;
    }
}
