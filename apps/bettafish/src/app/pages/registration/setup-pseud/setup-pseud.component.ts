import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pronouns, PseudonymForm } from '@dragonfish/shared/models/accounts';
import { fadeInOut } from '@dragonfish/client/ui';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { Router } from '@angular/router';

@Component({
    selector: 'dragonfish-setup-pseud',
    templateUrl: './setup-pseud.component.html',
    animations: [fadeInOut],
})
export class SetupPseudComponent {
    pronouns = Pronouns;
    loading = false;

    pseudForm = new FormGroup({
        userTag: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
        screenName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        pronouns: new FormControl([]),
    });

    constructor(private auth: AuthService, private alerts: AlertsService, private router: Router) {}

    submitForm() {
        this.loading = true;

        if (this.pseudForm.controls.userTag.invalid) {
            this.alerts.error(
                `Make sure your user tag has no special characters or spaces, and is between 3 and 16 characters.`,
            );
            return;
        }

        if (this.pseudForm.controls.screenName.invalid) {
            this.alerts.error(`Screen names must be between 3 and 32 characters.`);
            return;
        }

        const formData: PseudonymForm = {
            userTag: this.pseudForm.controls.userTag.value,
            screenName: this.pseudForm.controls.screenName.value,
            pronouns: this.pseudForm.controls.pronouns.value,
        };

        this.auth.createPseudonym(formData).subscribe(() => {
            this.loading = false;
            this.pseudForm.reset();
            this.router.navigate(['/registration/select-pseud']).catch((err) => console.log(err));
        });
    }
}
