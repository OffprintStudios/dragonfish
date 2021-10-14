import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'dragonfish-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
    accountEmail = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
}
