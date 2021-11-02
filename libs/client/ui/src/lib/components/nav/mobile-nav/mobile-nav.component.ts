import { Component, OnInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { NavigationStart, Router } from '@angular/router';
import { combineLatestWith, interval, switchMap } from 'rxjs';
import { ViewRef, ViewService } from '@ngneat/overview';
import { NotificationsQuery, NotificationsService } from '@dragonfish/client/repository/notifications';
import { UserMenuComponent } from '../../auth/user-menu/user-menu.component';

@Component({
    selector: 'dragonfish-mobile-nav',
    templateUrl: './mobile-nav.component.html',
    styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent implements OnInit {
    userMenu: ViewRef;

    constructor(
        public session: SessionQuery,
        public profiles: PseudonymsQuery,
        private router: Router,
        public notifications: NotificationsQuery,
        private notificationsService: NotificationsService,
        private viewService: ViewService,
    ) {}

    ngOnInit(): void {
        this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.userMenu) {
                    this.userMenu.destroy();
                    this.userMenu = undefined;
                }
            }
        });

        this.session.currAccount$
            .pipe(combineLatestWith(this.profiles.current$), untilDestroyed(this))
            .subscribe((values) => {
                const [account, profile] = values;
                if (account && profile) {
                    this.notificationsService
                        .getAllUnread()
                        .pipe(untilDestroyed(this))
                        .subscribe(() => {
                            interval(15000)
                                .pipe(
                                    switchMap(() => this.notificationsService.getAllUnread()),
                                    untilDestroyed(this),
                                )
                                .subscribe();
                        });
                }
            });
    }

    openUserMenu() {
        if (!this.userMenu) {
            this.userMenu = this.viewService.createView(UserMenuComponent);
            document.body.appendChild(this.userMenu.getElement() as any);
        } else {
            this.userMenu.destroy();
            this.userMenu = undefined;
        }
    }
}
