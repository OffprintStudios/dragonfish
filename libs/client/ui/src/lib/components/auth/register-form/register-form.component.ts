import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { AccountForm } from '@dragonfish/shared/models/accounts';

@Component({
    selector: 'dragonfish-register-form',
    templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
    @Output() isSuccess = new EventEmitter<AccountForm>();

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
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

        const info: AccountForm = {
            email: this.fields.email.value,
            password: this.fields.password.value,
            inviteCode: this.fields.inviteCode.value,
            termsAgree: this.fields.termsAgree.value,
        };

        this.isSuccess.emit(info);
    }
}
