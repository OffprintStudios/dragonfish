import { Component } from '@angular/core';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { AuthService } from '../../../repo/auth/services';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { UserState } from '../../../repo/user';
import { SidenavService } from '../../../services';

@Component({
    selector: 'dragonfish-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(private auth: AuthService, private dialog: MatDialog, private sidenavService: SidenavService) {}

    logout() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to log out?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToLogOut: boolean) => {
            if (wantsToLogOut) {
                this.auth.logout();
                this.sidenavService.close();
            }
        });
    }
}
