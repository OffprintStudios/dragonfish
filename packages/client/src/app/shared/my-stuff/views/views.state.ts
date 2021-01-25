import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

import { Views } from './views.actions';
import { ViewsStateModel } from './views-state.model';

@State<ViewsStateModel>({
    name: 'views',
    defaults: {
        content: null
    }
})
@Injectable()
export class ViewsState {

}