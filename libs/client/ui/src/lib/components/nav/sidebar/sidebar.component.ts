import { Component } from "@angular/core";
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Roles } from '@dragonfish/shared/models/users';
import { isAllowed } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(public sessionQuery: SessionQuery) {}

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
    }
}
