import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GlobalService } from './services';
import { GlobalStateModel } from './global-state.model';
import * as Global from './global.actions';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { ThemePref } from '@dragonfish/shared/models/users';
import { AlertsService } from '@dragonfish/client/alerts';

@State<GlobalStateModel>({
    name: 'global',
    defaults: {
        isOfAge: false,
        filter: ContentFilter.Default,
        theme: ThemePref.Crimson,
    },
})
@Injectable()
export class GlobalState {
    @Selector()
    static theme(state: GlobalStateModel): ThemePref {
        return state.theme;
    }

    @Selector()
    static filter(state: GlobalStateModel): ContentFilter {
        return state.filter;
    }

    constructor(private globalService: GlobalService, private alerts: AlertsService) {}

    /* Actions */
    @Action(Global.SetOfAge)
    public async setOfAge({ patchState }: StateContext<GlobalStateModel>) {
        patchState({
            isOfAge: true,
        });
    }

    @Action(Global.SetContentFilter)
    public async setContentFilter({ patchState }: StateContext<GlobalStateModel>, action: Global.SetContentFilter) {
        const filter = this.globalService.setContentFilter(action.enableMature, action.enableExplicit);
        patchState({
            filter: filter,
        });
        this.alerts.success(`Your content filter has been updated!`);
    }

    @Action(Global.SetThemePref)
    public async setThemePref({ patchState }: StateContext<GlobalStateModel>, action: Global.SetThemePref) {
        patchState({
            theme: action.newPref,
        });
    }
}
