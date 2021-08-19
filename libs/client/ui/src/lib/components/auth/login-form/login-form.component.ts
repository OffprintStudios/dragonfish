import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { LoginModel } from '@dragonfish/shared/models/accounts';

@Component({
    selector: 'dragonfish-login-form',
    templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
    @Output() isSuccess = new EventEmitter<LoginModel>();

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        rememberMe: new FormControl(false),
    });

    constructor(private auth: AuthService, private alerts: AlertsService) {}

    get fields() {
        return this.loginForm.controls;
    }

    submitForm() {
        if (this.fields.email.invalid) {
            this.alerts.error(`You need to provide a valid email address.`);
            return;
        }

        if (this.fields.password.invalid) {
            this.alerts.error(`You need to provide your password.`);
            return;
        }

        const info: LoginModel = {
            email: this.fields.email.value,
            password: this.fields.password.value,
            rememberMe: this.fields.rememberMe.value,
        };

        this.isSuccess.emit(info);
    }
}
