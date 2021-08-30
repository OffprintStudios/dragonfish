import { Component, OnInit } from '@angular/core';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PseudonymsService } from '@dragonfish/client/repository/pseudonyms/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
    changeScreenNameForm = new FormGroup({
        screenName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    });

    changeBioForm = new FormGroup({
        bio: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]),
    });

    taglineForm = new FormGroup({
        tagline: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
    });

    constructor(
        public pseudQuery: PseudonymsQuery,
        private pseudService: PseudonymsService,
        public sessionQuery: SessionQuery,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.pseudQuery.current$.pipe(untilDestroyed(this)).subscribe((user) => {
            this.changeScreenNameForm.setValue({
                screenName: user.screenName,
            });

            this.changeBioForm.setValue({
                bio: user.profile.bio,
            });

            this.taglineForm.setValue({
                tagline: user.profile.tagline,
            });
        });
    }

    selectPseud(id: string) {
        this.pseudService.setActive(id);
    }

    deselectPseud() {
        this.pseudService.deselect();
    }

    changeAvatar() {
        return;
    }

    canSeeTaglineForm(roles: Roles[]) {
        return isAllowed(roles, [
            Roles.VIP,
            Roles.Contributor,
            Roles.Maintainer,
            Roles.Moderator,
            Roles.ChatModerator,
            Roles.Admin,
        ]);
    }
}
