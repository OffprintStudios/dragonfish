import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUser } from '@dragonfish/shared/models/users';
import { AuthService } from '../../../repo/auth/services';

@Component({
    selector: 'dragonfish-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
    @Output() isSuccess = new EventEmitter<boolean>();

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        repeatPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        inviteCode: new FormControl('', [Validators.required]),
        termsAgree: new FormControl(false, [Validators.requiredTrue]),
        isMinAge: new FormControl(false, [Validators.requiredTrue]),
    });

    constructor(private auth: AuthService) {}

    get fields() {
        return this.registerForm.controls;
    }

    submitForm() {
        if (this.registerForm.invalid) {
            alert(`Check the info you've entered, because it doesn't look right to us.`);
            return;
        }

        if (this.fields.password.value !== this.fields.repeatPassword.value) {
            alert(`Your passwords don't match.`);
            return;
        }

        const info: CreateUser = {
            email: this.fields.email.value,
            username: this.fields.username.value,
            password: this.fields.password.value,
            inviteCode: this.fields.inviteCode.value,
            agreedToPolicies: this.fields.termsAgree.value,
        };

        this.auth.register(info).then(() => {
            this.isSuccess.emit(true);
        });
    }
}
