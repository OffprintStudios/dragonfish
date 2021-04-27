import { Component, OnInit } from '@angular/core';
import { GlobalState, GlobalStateModel, SetThemePref, SetContentFilter } from '../../../../repo/global';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie';

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

    setContentFilter = new FormGroup({
        enableMature: new FormControl(false),
        enableExplicit: new FormControl(false),
    });

    constructor(private store: Store, private cookies: CookieService) {}

    ngOnInit(): void {
        this.global$.pipe(untilDestroyed(this)).subscribe(global => {
            this.selectedTheme = global.theme;
            this.selectedFilter = global.filter;
        });

        const contentFilterSetting: ContentFilter = this.cookies.get('contentFilter') as ContentFilter;
        if (contentFilterSetting !== null && contentFilterSetting !== undefined) {
            this.setContentFilterToggles(contentFilterSetting);
        } else {
            this.setContentFilter.setValue({
                enableMature: false,
                enableExplicit: false,
            });
        }
    }

    get setFilterFields() {
        return this.setContentFilter.controls;
    }

    onThemeChange(event: ThemePref) {
        this.store.dispatch(new SetThemePref(event)).pipe(take(1)).subscribe();
    }

    submitContentFilter() {
        this.store
            .dispatch(
                new SetContentFilter(
                    this.setFilterFields.enableMature.value,
                    this.setFilterFields.enableExplicit.value,
                ),
            )
            .subscribe(() => {
                location.reload();
            });
    }

    private setContentFilterToggles(contentFilterSetting: ContentFilter) {
        switch (contentFilterSetting) {
            case ContentFilter.Default:
                this.setContentFilter.setValue({
                    enableMature: false,
                    enableExplicit: false,
                });
                break;
            case ContentFilter.Everything:
                this.setContentFilter.setValue({
                    enableMature: true,
                    enableExplicit: true,
                });
                break;
            case ContentFilter.MatureEnabled:
                this.setContentFilter.setValue({
                    enableMature: true,
                    enableExplicit: false,
                });
                break;
            case ContentFilter.ExplicitEnabled:
                this.setContentFilter.setValue({
                    enableMature: false,
                    enableExplicit: true,
                });
                break;
        }
    }
}
