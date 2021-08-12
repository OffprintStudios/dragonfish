import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PseudonymsService } from '@dragonfish/client/repository/pseudonyms/services';
import { isAllowed } from '@dragonfish/shared/functions';
import { Roles } from '@dragonfish/shared/models/accounts';

@Component({
    selector: 'dragonfish-select-pseud',
    templateUrl: './select-pseud.component.html',
    styleUrls: ['./select-pseud.component.scss'],
})
export class SelectPseudComponent {
    constructor(
        public pseudQuery: PseudonymsQuery,
        private pseudService: PseudonymsService,
        public sessionQuery: SessionQuery,
    ) {}

    canHaveFivePseuds(roles: Roles[]) {
        return isAllowed(roles, [Roles.VIP, Roles.Moderator, Roles.ChatModerator, Roles.Admin]);
    }
}
