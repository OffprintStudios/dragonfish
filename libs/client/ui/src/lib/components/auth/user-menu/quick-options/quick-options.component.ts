import { Component } from '@angular/core';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { Router } from '@angular/router';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { isAllowed } from '@dragonfish/shared/functions';
import { Roles } from '@dragonfish/shared/models/accounts';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-quick-options',
    templateUrl: './quick-options.component.html',
    styleUrls: ['./quick-options.component.scss'],
})
export class QuickOptionsComponent {
    constructor(
        public sessionQuery: SessionQuery,
        public pseudQuery: PseudonymsQuery,
        private dialog: MatDialog,
        private auth: AuthService,
        private router: Router,
    ) {}

    logout() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to log out?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToLogOut: boolean) => {
            if (wantsToLogOut) {
                this.auth.logout().subscribe(() => {
                    this.router.navigate(['/']).catch((err) => console.log(err));
                });
            }
        });
    }

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
    }
}
