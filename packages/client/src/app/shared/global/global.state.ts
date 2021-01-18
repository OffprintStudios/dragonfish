import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalService } from './services';
import { GlobalStateModel } from './global-state.model';
import { Global } from './global.actions';

import { Themes } from '@pulp-fiction/models/users';
import { ContentFilter } from '@pulp-fiction/models/content';

@State<GlobalStateModel>({
    name: 'global',
    defaults: {
        theme: Themes.Preference.Crimson,
        filter: ContentFilter.Default
    }
})
@Injectable()
export class GlobalState {
    constructor (private globalService: GlobalService) {}

    /* Actions */

    @Action(Global.ChangeTheme)
    changeTheme(ctx: StateContext<GlobalStateModel>, action: Global.ChangeTheme) {
        ctx.patchState({
            theme: action.pref
        })
    }

    @Action(Global.SetContentFilter)
    setContentFilter(ctx: StateContext<GlobalStateModel>, action: Global.SetContentFilter) {

    }

    /* Selectors */

    @Selector()
    static theme (state: GlobalStateModel): Themes.Preference {
        return state.theme;
    }
}