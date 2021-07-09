import { Component, OnInit } from '@angular/core';
import { ThemePref } from '@dragonfish/shared/models/users';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormGroup, FormControl } from '@angular/forms';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { AppQuery, AppService } from '@dragonfish/client/repository/app';

@UntilDestroy()
@Component({
    selector: 'dragonfish-global-settings',
    templateUrl: './global-settings.component.html',
    styleUrls: ['./global-settings.component.scss'],
})
export class GlobalSettingsComponent implements OnInit {
    themes = ThemePref;
    filters = ContentFilter;

    selectedTheme: ThemePref;
    canSeeFilters = false;

    setContentFilter = new FormGroup({
        enableMature: new FormControl(false),
        enableExplicit: new FormControl(false),
    });

    constructor(
        private dialog: MatDialog,
        private appService: AppService,
        public appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.GLOBAL_SETTINGS);

        this.appQuery.all$.pipe(untilDestroyed(this)).subscribe(app => {
            this.selectedTheme = app.theme;
            this.canSeeFilters = app.isOfAge;
            this.setContentFilterToggles(app.filter);
        });
    }

    get setFilterFields() {
        return this.setContentFilter.controls;
    }

    onThemeChange(event: ThemePref) {
        this.appService.updateThemePref(event);
    }

    submitContentFilter() {
        this.appService.setContentFilter(
            this.setFilterFields.enableMature.value,
            this.setFilterFields.enableExplicit.value
        );
    }

    setOfAge() {
        const alertData: PopupModel = {
            message: 'These settings are for people aged 18 or older. Are you sure you want to proceed?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToChangeFilter: boolean) => {
            if (wantsToChangeFilter) {
                this.appService.setOfAge();
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
