import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from '@dragonfish/shared/models/users';
import { isAllowed } from '@dragonfish/shared/functions';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { ElectronService } from 'ngx-electron';
import { SidenavService } from '../../../services';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    constructor(
        private dialog: MatDialog,
        public electron: ElectronService,
        public sidenavService: SidenavService,
        public sessionQuery: SessionQuery,
    ) {}

    openSidenav() {
        this.dialog.open(AuthModalComponent);
    }

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
    }
}
