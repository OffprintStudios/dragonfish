import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GlobalService } from './services';
import { GlobalStateModel } from './global-state.model';
import * as Global from './global.actions';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { ThemePref } from '@dragonfish/shared/models/users';

@State<GlobalStateModel>({
    name: 'global',
    defaults: {
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

    constructor(private globalService: GlobalService) {}

    /* Actions */
    @Action(Global.SetContentFilter)
    public async setContentFilter({ patchState }: StateContext<GlobalStateModel>, action: Global.SetContentFilter) {
        return await this.globalService.setContentFilter(action.enableMature, action.enableExplicit).then((filter) => {
            patchState({
                filter: filter,
            });
        });
    }

    @Action(Global.SetThemePref)
    public async setThemePref({ patchState }: StateContext<GlobalStateModel>, action: Global.SetThemePref) {
        patchState({
            theme: action.newPref,
        });
    }
}
