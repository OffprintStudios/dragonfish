import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';
import { DragonfishElectronService } from '@dragonfish/client/services';
import { UserMenuComponent } from '../../auth/user-menu/user-menu.component';
import { ViewRef, ViewService } from '@ngneat/overview';
import { NavigationStart, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { combineLatestWith, interval, switchMap, tap, zip } from 'rxjs';
import { NotificationsRepository } from '@dragonfish/client/repository/notifications';

@Component({
    selector: 'dragonfish-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    userMenu: ViewRef;
    activeUserMenu = false;

    constructor(
        public sessionQuery: SessionQuery,
        public pseudQuery: PseudonymsQuery,
        public electron: DragonfishElectronService,
        private router: Router,
        private viewService: ViewService,
        public notifications: NotificationsRepository,
    ) {}

    ngOnInit(): void {
        this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.userMenu) {
                    this.userMenu.destroy();
                    this.userMenu = undefined;
                    this.activeUserMenu = false;
                }
            }
        });

        this.sessionQuery.currAccount$
            .pipe(combineLatestWith(this.pseudQuery.current$), untilDestroyed(this))
            .subscribe((values) => {
                const [account, profile] = values;
                if (account && profile) {
                    this.notifications
                        .getAllUnread()
                        .pipe(untilDestroyed(this))
                        .subscribe(() => {
                            interval(15000)
                                .pipe(
                                    switchMap(() => this.notifications.getAllUnread()),
                                    untilDestroyed(this),
                                )
                                .subscribe();
                        });
                }
            });
    }

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
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
