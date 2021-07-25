import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { Router } from '@angular/router';

@Component({
    selector: 'dragonfish-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
    constructor(public sessionQuery: SessionQuery, private dialog: MatDialog, private auth: AuthService, private router: Router) {}

    logout() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to log out?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToLogOut: boolean) => {
            if (wantsToLogOut) {
                this.auth.logout().subscribe(() => {
                    this.router.navigate(['/']).catch(err => console.log(err));
                });
            }
        });
    }
}
