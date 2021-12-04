import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PseudonymsService } from '@dragonfish/client/repository/pseudonyms/services';
import { isAllowed } from '@dragonfish/shared/functions';
import { Roles } from '@dragonfish/shared/models/accounts';
import { Router } from '@angular/router';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-select-pseud',
    templateUrl: './select-pseud.component.html',
    styleUrls: ['./select-pseud.component.scss'],
})
export class SelectPseudComponent implements OnInit {
    constructor(
        public pseudQuery: PseudonymsQuery,
        private pseudService: PseudonymsService,
        public sessionQuery: SessionQuery,
        private router: Router,
    ) {}
    
    ngOnInit(): void {
        setTwoPartTitle(Constants.SELECT_PROFILE);
    }

    canHaveFivePseuds(roles: Roles[]) {
        return isAllowed(roles, [Roles.VIP, Roles.Moderator, Roles.ChatModerator, Roles.Admin]);
    }

    selectPseud(id: string) {
        this.pseudService.setActive(id);
    }

    deselectPseud() {
        this.pseudService.deselect();
    }

    selectAndClose(id: string) {
        this.pseudService.setActive(id);
        this.router.navigate(['/']).catch((err) => console.log(err));
    }
}
