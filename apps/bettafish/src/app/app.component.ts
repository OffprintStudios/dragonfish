import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ElectronService } from 'ngx-electron';
import { SidenavService } from './services';
import { NavigationStart, Router } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { PopupComponent } from '@dragonfish/client/ui';
import { PopupModel } from '@dragonfish/shared/models/util';
import { AppQuery } from '@dragonfish/client/repository/app';

@UntilDestroy()
@Component({
    selector: 'dragonfish-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('sidenav') public sidenav: MatSidenav;

    constructor(
        private auth: AuthService,
        private dialog: MatDialog,
        public electron: ElectronService,
        public sidenavService: SidenavService,
        private router: Router,
        public sessionQuery: SessionQuery,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        this.appQuery.theme$.pipe(untilDestroyed(this)).subscribe((theme) => {
            const body = document.getElementsByTagName('body')[0];
            const currTheme = body.classList.item(0);
            const html = document.getElementsByTagName('html')[0];
            if (ThemePref[theme] !== null && ThemePref[theme] !== undefined) {
                if (
                    ThemePref[theme] == 'dark-aqua' ||
                    ThemePref[theme] == 'dark-crimson' ||
                    ThemePref[theme] == 'dark-field' ||
                    ThemePref[theme] == 'dark-royal' ||
                    ThemePref[theme] === 'dusk-autumn'
                ) {
                    body.classList.replace(currTheme, ThemePref[theme]);
                    html.classList.add('dark');
                } else {
                    body.classList.replace(currTheme, ThemePref[theme]);
                    html.classList.remove('dark');
                }
            } else {
                body.classList.replace(currTheme, 'crimson');
            }
        });

        this.router.events.pipe(untilDestroyed(this), delay(300)).subscribe((event) => {
            if (this.sidenav) {
                if (event instanceof NavigationStart) {
                    this.sidenavService.close();
                }
            }
        });
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
                    this.sidenavService.close();
                });
            }
        });
    }

    openAuthModal() {
        this.dialog.open(AuthModalComponent);
    }

    ngAfterViewInit() {
        this.sessionQuery.currentUser$.pipe(untilDestroyed(this), delay(300)).subscribe((user) => {
            if (user !== null || !this.electron.isElectronApp) {
                this.sidenavService.setSidenav(this.sidenav);
            }
        });
    }
}
