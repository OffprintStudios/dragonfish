import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MyStuff } from './my-stuff.actions';
import { MyStuffStateModel } from './my-stuff-state.model';
import { ViewsState } from './views';

@State<MyStuffStateModel>({
    name: 'myStuff',
    defaults: {
        myStuff: null
    },
    children: [ViewsState]
})
@Injectable()
export class MyStuffState {
    
}