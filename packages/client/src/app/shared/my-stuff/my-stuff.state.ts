import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MyStuff } from './my-stuff.actions';
import { MyStuffStateModel } from './my-stuff-state.model';
import { MyStuffService } from './services';
import { AlertsState } from '../alerts';
import { ContentModel } from '@pulp-fiction/models/content';

@State<MyStuffStateModel>({
    name: 'myStuff',
    defaults: {
        myStuff: null,
        currContent: null
    }
})
@Injectable()
export class MyStuffState {
    constructor (private stuffService: MyStuffService) {}

    @Action(MyStuff.SetFiles)
    setFiles({ patchState }: StateContext<MyStuffStateModel>): Observable<ContentModel[]> {
        return this.stuffService.fetchAll().pipe(tap((result: ContentModel[]) => {
            patchState({
                myStuff: result
            });
        }));
    }

    @Action(MyStuff.CreateContent)
    createContent({ getState }: StateContext<MyStuffStateModel>) {
        
    }

    @Action(MyStuff.SaveContent)
    saveContent() {

    }

    @Action(MyStuff.UploadCoverArt)
    uploadCoverArt() {

    }
}