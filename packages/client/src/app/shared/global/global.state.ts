import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { GlobalService } from './services';
import { GlobalStateModel } from './global-state.model';
import { Global } from './global.actions';

import { Themes } from '../../models/site';
import { ContentFilter } from '@pulp-fiction/models/content';

@State<GlobalStateModel>({
    name: 'global',
    defaults: {
        theme: Themes.Preference.Crimson,
        filter: ContentFilter.Default
    }
})
export class GlobalState {
    constructor (private globalService: GlobalService) {}

    /* Actions */

    @Action(Global.ChangeTheme)
    changeTheme(ctx: StateContext<GlobalStateModel>) {

    }

    @Action(Global.SetContentFilter)
    setContentFilter() {

    }
}