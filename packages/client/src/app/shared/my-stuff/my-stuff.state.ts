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
import { SectionsState } from './sections';

@State<MyStuffStateModel>({
    name: 'myStuff',
    defaults: {
        myStuff: [],
        currContent: null
    },
    children: [SectionsState]
})
@Injectable()
export class MyStuffState {
    constructor (private stuffService: MyStuffService) { }

    @Action(MyStuff.SetFiles)
    public setFiles({ patchState }: StateContext<MyStuffStateModel>): Observable<ContentModel[]> {
        return this.stuffService.fetchAll().pipe(tap((result: ContentModel[]) => {
            patchState({
                myStuff: result
            });
        }));
    }

    @Action(MyStuff.SetCurrentContent)
    public setCurrentContent({ patchState }: StateContext<MyStuffStateModel>, { content }: MyStuff.SetCurrentContent): void {
        patchState({
            currContent: content
        });
    }

    @Action(MyStuff.CreateContent)
    public createContent({ getState, patchState, dispatch }: StateContext<MyStuffStateModel>, { kind, formInfo }: MyStuff.CreateContent): Observable<ContentModel> {
        return this.stuffService.createContent(kind, formInfo).pipe(tap((result: ContentModel) => {
            dispatch(new Alerts.Success(`Content saved!`));
            patchState({
                myStuff: [...getState().myStuff, result]
            });
        }), catchError(err => {
            dispatch(new Alerts.Error(err.error.message));
            return throwError(err);
        }));
    }

    @Action(MyStuff.SaveContent)
    public saveContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId, kind, formInfo }: MyStuff.SaveContent): Observable<ContentModel> {
        return this.stuffService.saveContent(contentId, kind, formInfo).pipe(tap((result: ContentModel) => {
            dispatch(new Alerts.Success(`Changes saved!`));
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
    public deleteContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId }: MyStuff.DeleteContent): Observable<void> {
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
    public publishContent({ setState, dispatch }: StateContext<MyStuffStateModel>, { contentId, pubChange }: MyStuff.PublishContent): Observable<ContentModel> {
        return this.stuffService.publishOne(contentId, pubChange).pipe(tap((result: ContentModel) => {
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
    public uploadCoverArt({ setState, dispatch }: StateContext<MyStuffStateModel>, { kind, uploader }: MyStuff.UploadCoverArt): Observable<ContentModel> {
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
    public static myStuff(state: MyStuffStateModel): ContentModel[] {
        return state.myStuff;
    }

    @Selector()
    public static currContent(state: MyStuffStateModel): ContentModel {
        return state.currContent;
    }
}