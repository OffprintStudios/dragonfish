import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { ThemePref } from '@dragonfish/shared/models/users';
import { CardSize } from '@dragonfish/shared/models/util';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { AlertsService } from '@dragonfish/client/alerts';

interface AppState {
    isOfAge: boolean;
    filter: ContentFilter;
    theme: ThemePref;
    workCardSize: CardSize;
}

const { state, config } = createState(
    withProps<AppState>({
        isOfAge: false,
        filter: ContentFilter.Default,
        theme: ThemePref.Crimson,
        workCardSize: CardSize.Small,
    }),
);

const store = new Store({ state, name: 'app', config });
export const persist = persistState(store, { key: 'app', storage: localStorageStrategy });

@Injectable({ providedIn: 'root' })
export class AppRepository {
    public workCardSize$ = store.pipe(select((state) => state.workCardSize));
    public theme$ = store.pipe(select((state) => state.theme));
    public filter$ = store.pipe(select((state) => state.filter));

    constructor(private alerts: AlertsService) {}

    public setOfAge() {
        store.update((state) => ({
            ...state,
            isOfAge: true,
        }));
    }

    public setContentFilter(enableMature: boolean, enableExplicit: boolean) {
        const filter = this.determineContentFilter(enableMature, enableExplicit);
        store.update((state) => ({
            ...state,
            filter: filter,
        }));
        this.alerts.success(`Content filters have been updated.`);
    }

    public updateThemePref(newPref: ThemePref) {
        store.update((state) => ({
            ...state,
            theme: newPref,
        }));
    }

    public setWorkCardSize(newSize: CardSize) {
        store.update((state) => ({
            ...state,
            workCardSize: newSize,
        }));
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

    //#region ---GETTERS---

    public get workCardSize() {
        return store.getValue().workCardSize;
    }

    public get filter() {
        return store.getValue().filter;
    }

    //#endregion
}
