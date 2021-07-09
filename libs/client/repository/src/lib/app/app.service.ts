import { Injectable } from '@angular/core';
import { AppStore } from './app.store';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { ThemePref } from '@dragonfish/shared/models/users';

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(
        private appStore: AppStore,
        private alerts: AlertsService,
    ) {}

    public setOfAge() {
        this.appStore.update({
            isOfAge: true,
        });
    }

    public setContentFilter(enableMature: boolean, enableExplicit: boolean) {
        const filter = this.determineContentFilter(enableMature, enableExplicit);
        this.appStore.update({
            filter: filter,
        });
        this.alerts.success(`Content filters have been updated.`);
    }

    public updateThemePref(newPref: ThemePref) {
        this.appStore.update({
            theme: newPref,
        });
    }

    //#region ---PRIVATE---

    /**
     * Sets the contentFilter cookie based on the values of the two provided booleans.
     *
     * @param enableMature Enable mature check
     * @param enableExplicit Enable explicit check
     */
    private determineContentFilter(enableMature: boolean, enableExplicit: boolean) {
        let filterSetting: ContentFilter = ContentFilter.Default;

        if (enableMature === true && enableExplicit === false) {
            filterSetting = ContentFilter.MatureEnabled;
        } else if (enableMature === false && enableExplicit === true) {
            filterSetting = ContentFilter.ExplicitEnabled;
        } else if (enableMature === true && enableExplicit === true) {
            filterSetting = ContentFilter.Everything;
        } else if (enableMature === false && enableExplicit === false) {
            filterSetting = ContentFilter.Default;
        }

        return filterSetting;
    }

    //#endregion
}
