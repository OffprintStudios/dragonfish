import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ElectronService } from 'ngx-electron';
import { SidenavService } from './services';
import { NavigationStart, Router } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { delay } from 'rxjs/operators';
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
        public electron: ElectronService,
        public sidenavService: SidenavService,
        private router: Router,
        public sessionQuery: SessionQuery,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        this.appQuery.theme$.pipe(untilDestroyed(this)).subscribe(theme => {
            const body = document.getElementsByTagName('body')[0];
            const currTheme = body.classList.item(0);
            const html = document.getElementsByTagName('html')[0];
            console.log(typeof ThemePref[theme]);
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

        this.router.events.pipe(untilDestroyed(this)).subscribe(event => {
            if (this.sidenav) {
                if (event instanceof NavigationStart) {
                    this.sidenavService.close();
                }
            }
        });
    }

    ngAfterViewInit() {
        this.sessionQuery.currentUser$.pipe(untilDestroyed(this), delay(300)).subscribe(user => {
            if (user !== null || !this.electron.isElectronApp) {
                this.sidenavService.setSidenav(this.sidenav);
            }
        });
    }
}
