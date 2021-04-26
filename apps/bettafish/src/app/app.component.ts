import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FrontendUser, ThemePref } from '@dragonfish/shared/models/users';
import { UserState } from './repo/user';
import { ElectronService } from 'ngx-electron';
import { GlobalState } from './repo/global';

@UntilDestroy()
@Component({
    selector: 'dragonfish-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    @Select(GlobalState.theme) theme$: Observable<ThemePref>;
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(public electron: ElectronService) {}

    ngOnInit(): void {
        this.theme$.pipe(untilDestroyed(this)).subscribe(theme => {
            const body = document.getElementsByTagName('body')[0];
            const currTheme = body.classList.item(0);
            body.classList.replace(currTheme, this.switchTheme(theme));
        });
    }

    private switchTheme(theme: ThemePref) {
        switch (theme) {
            case ThemePref.Crimson:
                return 'crimson';
            case ThemePref.DarkCrimson:
                return 'dark-crimson';
            case ThemePref.Aqua:
                return 'aqua';
            case ThemePref.DarkAqua:
                return 'dark-aqua';
            case ThemePref.Royal:
                return 'royal';
            case ThemePref.DarkRoyal:
                return 'dark-royal';
            case ThemePref.Field:
                return 'field';
            case ThemePref.MidnightField:
                return 'midnight-field';
            case ThemePref.Autumn:
                return 'autumn';
            case ThemePref.DuskAutumn:
                return 'dusk-autumn';
            default:
                return 'crimson';
        }
    }
}
