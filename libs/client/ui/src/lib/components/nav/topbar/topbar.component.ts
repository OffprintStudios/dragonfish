import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { ViewRef, ViewService } from '@ngneat/overview';
import { UserMenuComponent } from '../../auth/user-menu/user-menu.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InboxComponent } from '../../inbox/inbox.component';

@UntilDestroy()
@Component({
    selector: 'dragonfish-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    private userMenu: ViewRef;
    activeUserMenu = false;

    private inbox: ViewRef;
    activeInbox = false;

    constructor(
        public sessionQuery: SessionQuery,
        private auth: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private viewService: ViewService,
    ) {}

    ngOnInit() {
        this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.userMenu) {
                    this.userMenu.destroy();
                    this.userMenu = undefined;
                    this.activeUserMenu = false;
                }

                if (this.inbox) {
                    this.inbox.destroy();
                    this.inbox = undefined;
                    this.activeInbox = false;
                }
            }
        });
    }

    openUserMenu() {
        if (!this.userMenu && this.inbox) {
            this.inbox.destroy();
            this.inbox = undefined;
            this.activeInbox = false;
            this.userMenu = this.viewService.createView(UserMenuComponent);
            document.body.appendChild(this.userMenu.getElement() as any);
            this.activeUserMenu = true;
        } else if (!this.userMenu) {
            this.userMenu = this.viewService.createView(UserMenuComponent);
            document.body.appendChild(this.userMenu.getElement() as any);
            this.activeUserMenu = true;
        } else {
            this.userMenu.destroy();
            this.userMenu = undefined;
            this.activeUserMenu = false;
        }
    }

    openInbox() {
        if (!this.inbox && this.userMenu) {
            this.userMenu.destroy();
            this.userMenu = undefined;
            this.activeUserMenu = false;
            this.inbox = this.viewService.createView(InboxComponent);
            document.body.appendChild(this.inbox.getElement() as any);
            this.activeInbox = true;
        } else if (!this.inbox) {
            this.inbox = this.viewService.createView(InboxComponent);
            document.body.appendChild(this.inbox.getElement() as any);
            this.activeInbox = true;
        } else {
            this.inbox.destroy();
            this.inbox = undefined;
            this.activeInbox = false;
        }
    }
}
