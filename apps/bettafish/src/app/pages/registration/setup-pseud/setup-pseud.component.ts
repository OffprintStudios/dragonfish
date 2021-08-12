import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pronouns } from '@dragonfish/shared/models/accounts';
import { fadeInOut } from '@dragonfish/client/ui';

@Component({
    selector: 'dragonfish-setup-pseud',
    templateUrl: './setup-pseud.component.html',
    animations: [fadeInOut],
})
export class SetupPseudComponent {
    pronouns = Pronouns;

    pseudForm = new FormGroup({
        userTag: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
        screenName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        pronouns: new FormControl(null),
    });

    constructor() {}

    submitForm() {
        return;
    }
}
