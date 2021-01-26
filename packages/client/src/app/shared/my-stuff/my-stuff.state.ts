import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { patch, updateItem, removeItem } from '@ngxs/store/operators';

import { MyStuff } from './my-stuff.actions';
import { MyStuffStateModel } from './my-stuff-state.model';
import { MyStuffService } from './services';
import { ContentKind, ContentModel } from '@pulp-fiction/models/content';
import { Alerts } from '../alerts';
import { UserStateModel } from '../user';

@State<MyStuffStateModel>({
    name: 'myStuff',
    defaults: {
        myStuff: [],
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

    @Action(MyStuff.SetCurrentContent)
    setCurrentContent({ patchState }: StateContext<MyStuffStateModel>, { content }: MyStuff.SetCurrentContent): void {
        patchState({
            currContent: content
        });
    }

    @Action(MyStuff.CreateContent)
    createContent({ getState, patchState, dispatch }: StateContext<MyStuffStateModel>, { kind, formInfo }: MyStuff.CreateContent): Observable<ContentModel> {
        return this.stuffService.createContent(kind, formInfo).pipe(tap((result: ContentModel) => {
            patchState({
                myStuff: [...getState().myStuff, result]
            });
        }), catchError(err => {
            dispatch(new Alerts.Error(err.error.message));
            return throwError(err);
        }));
    }

    @Action(MyStuff.SaveContent)
    saveContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId, kind, formInfo }: MyStuff.SaveContent): Observable<ContentModel> {
        return this.stuffService.saveContent(contentId, kind, formInfo).pipe(tap((result: ContentModel) => {
            setState(patch({
                myStuff: updateItem<ContentModel>(content => content._id === result._id, result),
                currContent: result
            }));
        }), catchError(err => {
            dispatch(new Alerts.Error(err.error.message));
            return throwError(err);
        }));
    }

    @Action(MyStuff.DeleteContent)
    deleteContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId }: MyStuff.DeleteContent): Observable<void> {
        return this.stuffService.deleteOne(contentId).pipe(tap((_res: void) => {
            setState(patch({
                myStuff: removeItem<ContentModel>(content => content._id === contentId),
                currContent: null
            }));
        }), catchError(err => {
            dispatch(new Alerts.Error(err.error.message));
            return throwError(err);
        }));
    }

    @Action(MyStuff.PublishContent)
    publishContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId }: MyStuff.PublishContent): Observable<ContentModel> {
        return this.stuffService.publishOne(contentId).pipe(tap((result: ContentModel) => {
            setState(patch({
                myStuff: updateItem<ContentModel>(content => content._id === result._id, result),
                currContent: result
            }));
        }), catchError(err => {
            dispatch(new Alerts.Error(err.error.message));
            return throwError(err);
        }));
    }

    @Action(MyStuff.UploadCoverArt)
    uploadCoverArt({ setState, dispatch }: StateContext<MyStuffStateModel>, { kind, uploader }: MyStuff.UploadCoverArt): Observable<ContentModel> {
        if (kind === ContentKind.BlogContent || kind === ContentKind.NewsContent) {
            dispatch(new Alerts.Error(`Incorrect content type for this action.`));
            return;
        }

        return this.stuffService.uploadCoverart(uploader).pipe(tap((result: ContentModel) => {
            setState(patch({
                myStuff: updateItem<ContentModel>(content => content._id === result._id, result),
                currContent: result
            }));
        }), catchError(err => {
            dispatch(new Alerts.Error(`Something went wrong! Try again in a little bit.`));
            return throwError(err);
        }));
    }

    /* Selectors */

    @Selector()
    static myStuff(state: MyStuffStateModel): ContentModel[] {
        return state.myStuff;
    }

    @Selector()
    static currContent(state: MyStuffStateModel): ContentModel {
        return state.currContent;
    }
}