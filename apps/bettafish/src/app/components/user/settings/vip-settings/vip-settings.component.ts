import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { FrontendUser, Roles, UpdateTagline } from '@dragonfish/shared/models/users';
import { isAllowed } from '@dragonfish/shared/functions';
import { AlertsService } from '@dragonfish/client/alerts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { UserState } from '@dragonfish/client/repository/user';
import { UserService } from '@dragonfish/client/repository/user/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-vip-settings',
    templateUrl: './vip-settings.component.html',
    styleUrls: ['./vip-settings.component.scss'],
})
export class VipSettingsComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    taglineForm = new FormGroup({
        tagline: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    });

    constructor(private user: UserService, private alerts: AlertsService) {}

    ngOnInit(): void {
        this.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.taglineForm.setValue({
                tagline: user.profile.tagline,
            });
        });
    }

    get taglineFields() { return this.taglineForm.controls; }

    isAllowed(userRoles: Roles[]) {
        return isAllowed(userRoles, [
            Roles.VIP,
            Roles.Maintainer,
            Roles.Contributor,
            Roles.WorkApprover,
            Roles.Moderator,
            Roles.Admin,
        ]);
    }

    submitTagline() {
        if (this.taglineFields.tagline.invalid) {
            this.alerts.info(`Taglines can only be between 3 and 36 characters long.`);
            return;
        }
        const changeRequest: UpdateTagline = {
            newTagline: this.taglineFields.tagline.value
        };

        return this.user.updateTagline(changeRequest);
    }
}
