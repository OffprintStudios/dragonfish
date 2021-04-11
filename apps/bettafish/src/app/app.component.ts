import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { UserState } from './repo/user';
import { ElectronService } from 'ngx-electron';

@UntilDestroy()
@Component({
    selector: 'dragonfish-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(public electron: ElectronService) {}

    ngOnInit(): void {
        this.currentUser$.pipe(untilDestroyed(this)).subscribe(user => {
            const body = document.getElementsByTagName('body')[0];
            const currTheme = body.classList.item(0);
            if (user === null) {
                body.classList.replace(currTheme, 'crimson');
            } else {
                body.classList.replace(currTheme, user.profile.themePref);
            }
        });
    }
}
