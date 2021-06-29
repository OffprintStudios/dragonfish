import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { ViewRef, ViewService } from '@ngneat/overview';
import { UserMenuComponent } from '../../auth/user-menu/user-menu.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    private userMenu: ViewRef;
    activeUserMenu = false;

    constructor(
        public sessionQuery: SessionQuery,
        private auth: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private viewService: ViewService,
    ) {}

    ngOnInit() {
        this.router.events.pipe(untilDestroyed(this)).subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.userMenu) {
                    this.userMenu.destroy();
                    this.userMenu = undefined;
                    this.activeUserMenu = false;
                }
            }
        });
    }

    openAuthModal() {
        this.dialog.open(AuthModalComponent);
    }

    openUserMenu() {
        if (!this.userMenu) {
            this.userMenu = this.viewService.createView(UserMenuComponent);
            document.body.appendChild(this.userMenu.getElement() as any);
            this.activeUserMenu = true;
        } else {
            this.userMenu.destroy();
            this.userMenu = undefined;
            this.activeUserMenu = false;
        }
    }
}
