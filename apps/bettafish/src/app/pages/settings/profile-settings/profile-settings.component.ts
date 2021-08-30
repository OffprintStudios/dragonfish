import { Component } from '@angular/core';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PseudonymsService } from '@dragonfish/client/repository/pseudonyms/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Router } from '@angular/router';
import { Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {
    constructor(
        public pseudQuery: PseudonymsQuery,
        private pseudService: PseudonymsService,
        public sessionQuery: SessionQuery,
        private router: Router,
    ) {}

    canHaveFivePseuds(roles: Roles[]) {
        return isAllowed(roles, [Roles.VIP, Roles.Moderator, Roles.ChatModerator, Roles.Admin]);
    }

    selectPseud(id: string) {
        this.pseudService.setActive(id);
    }

    deselectPseud() {
        this.pseudService.deselect();
    }
}
