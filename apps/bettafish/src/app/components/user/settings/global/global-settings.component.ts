import { Component, OnInit } from '@angular/core';
import { GlobalState, GlobalStateModel, SetThemePref, SetContentFilter, SetOfAge } from '../../../../repo/global';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';

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
    canSeeFilters = false;

    setContentFilter = new FormGroup({
        enableMature: new FormControl(false),
        enableExplicit: new FormControl(false),
    });

    constructor(private store: Store, private dialog: MatDialog) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.GLOBAL_SETTINGS);

        this.global$.pipe(untilDestroyed(this)).subscribe(global => {
            this.selectedTheme = global.theme;
            this.canSeeFilters = global.isOfAge;
            this.setContentFilterToggles(global.filter);
        });
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
            .subscribe();
    }

    setOfAge() {
        const alertData: PopupModel = {
            message: 'These settings are for people aged 18 or older. Are you sure you want to proceed?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToChangeFilter: boolean) => {
            if (wantsToChangeFilter) {
                this.store.dispatch(new SetOfAge()).subscribe();
            }
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
