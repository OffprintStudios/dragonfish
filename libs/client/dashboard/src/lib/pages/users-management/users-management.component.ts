import { Component } from '@angular/core';
import { InviteCodes } from '@dragonfish/shared/models/users';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent {
    currCode: InviteCodes;

    sendCode = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required]),
    });

    constructor(private userManagement: DragonfishNetworkService, private alerts: AlertsService) {}

    generateCode() {
        this.userManagement.generateCode().subscribe((code) => {
            this.currCode = code;
        });
    }

    sendInviteCode() {
        if (this.sendCode.controls.email.invalid) {
            this.alerts.error(`This is not a valid email address`);
            return;
        }

        this.userManagement.sendInviteCode(this.sendCode.controls.email.value).subscribe(() => {
            this.alerts.success(`Code sent!`);
            this.sendCode.reset();
        });
    }
}
