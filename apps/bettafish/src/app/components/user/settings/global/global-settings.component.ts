import { Component, OnInit } from '@angular/core';
import { GlobalState, GlobalStateModel, SetThemePref, SetContentFilter } from '../../../../repo/global';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';

@UntilDestroy()
@Component({
    selector: 'dragonfish-global-settings',
    templateUrl: './global-settings.component.html',
    styleUrls: ['./global-settings.component.scss'],
})
export class GlobalSettingsComponent implements OnInit {
    @Select(GlobalState) global$: Observable<GlobalStateModel>;
    themes = ThemePref;
    filters = ContentFilter;

    selectedTheme: ThemePref;
    selectedFilter: ContentFilter;

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.global$.pipe(untilDestroyed(this)).subscribe(global => {
            this.selectedTheme = global.theme;
            this.selectedFilter = global.filter;
        });
    }

    onThemeChange(event: ThemePref) {
        this.store.dispatch(new SetThemePref(event)).pipe(take(1)).subscribe();
    }

    onFilterChange(event: ContentFilter) {
        console.log(event);
    }
}
