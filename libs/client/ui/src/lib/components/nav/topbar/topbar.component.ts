import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';

@Component({
    selector: 'dragonfish-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
    constructor(public sessionQuery: SessionQuery, private auth: AuthService, private dialog: MatDialog, private router: Router) {}

    openAuthModal() {
        this.dialog.open(AuthModalComponent);
    }

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
