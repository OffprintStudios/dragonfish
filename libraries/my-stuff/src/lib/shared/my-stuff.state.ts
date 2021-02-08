import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { patch, updateItem, removeItem } from '@ngxs/store/operators';

import { MyStuff } from './my-stuff.actions';
import { MyStuffStateModel } from './my-stuff-state.model';
import { ContentModel } from '@dragonfish/models/content';
import { AlertsService } from '@dragonfish/alerts';
import { SectionsState } from './sections';
import { MyStuffService } from './services';

@State<MyStuffStateModel>({
    name: 'myStuff',
    defaults: {
        myStuff: [],
        currContent: null,
        currContentWordCount: 0,
    },
    children: [SectionsState],
})
@Injectable()
export class MyStuffState {
    constructor(private myStuff: MyStuffService, private alerts: AlertsService) {}

    @Action(MyStuff.SetFiles)
    public setFiles({ patchState }: StateContext<MyStuffStateModel>): Observable<ContentModel[]> {
        return this.myStuff.fetchAll().pipe(
            tap((result: ContentModel[]) => {
                patchState({
                    myStuff: result,
                });
            }),
        );
    }

    @Action(MyStuff.SetCurrentContent)
    public setCurrentContent(
        { patchState }: StateContext<MyStuffStateModel>,
        { content }: MyStuff.SetCurrentContent,
    ): void {
        patchState({
            currContent: content,
            currContentWordCount: content === null ? 0 : content.stats.words,
        });
    }

    @Action(MyStuff.CreateContent)
    public createContent(
        { getState, patchState }: StateContext<MyStuffStateModel>,
        { kind, formInfo }: MyStuff.CreateContent,
    ): Observable<ContentModel> {
        return this.myStuff.createContent(kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.alerts.success(`Content saved!`);
                patchState({
                    myStuff: [...getState().myStuff, result],
                });
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(MyStuff.SaveContent)
    public saveContent(
        { setState }: StateContext<MyStuffStateModel>,
        { contentId, kind, formInfo }: MyStuff.SaveContent,
    ): Observable<ContentModel> {
        return this.myStuff.saveContent(contentId, kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.alerts.success(`Changes saved!`);
                setState(
                    patch({
                        myStuff: updateItem<ContentModel>((content) => content._id === result._id, result),
                        currContent: result,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(MyStuff.DeleteContent)
    public deleteContent(
        { setState }: StateContext<MyStuffStateModel>,
        { contentId }: MyStuff.DeleteContent,
    ): Observable<void> {
        return this.myStuff.deleteOne(contentId).pipe(
            tap((_res: void) => {
                setState(
                    patch({
                        myStuff: removeItem<ContentModel>((content) => content._id === contentId),
                        currContent: null,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(MyStuff.PublishContent)
    public publishContent(
        { setState }: StateContext<MyStuffStateModel>,
        { contentId, pubChange }: MyStuff.PublishContent,
    ): Observable<ContentModel> {
        return this.myStuff.publishOne(contentId, pubChange).pipe(
            tap((result: ContentModel) => {
                setState(
                    patch({
                        myStuff: updateItem<ContentModel>((content) => content._id === result._id, result),
                        currContent: result,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(MyStuff.UploadCoverArt)
    public uploadCoverArt(
        { setState }: StateContext<MyStuffStateModel>,
        { uploader }: MyStuff.UploadCoverArt,
    ): Observable<ContentModel> {
        return this.myStuff.uploadCoverart(uploader).pipe(
            tap((result: ContentModel) => {
                setState(
                    patch({
                        myStuff: updateItem<ContentModel>((content) => content._id === result._id, result),
                        currContent: result,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                return throwError(err);
            }),
        );
    }

    @Action(MyStuff.UpdateWordcount)
    public updateWordcount(
        { getState, patchState }: StateContext<MyStuffStateModel>,
        { section, pubStatus }: MyStuff.UpdateWordcount,
    ) {
        if (section.published === true && pubStatus.oldPub === false) {
            // if newly published
            patchState({
                currContentWordCount: getState().currContentWordCount + section.stats.words,
            });
        } else if (section.published === false && pubStatus.oldPub === true) {
            // if unpublished
            patchState({
                currContentWordCount: getState().currContentWordCount - section.stats.words,
            });
        }
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

    @Selector()
    public static currContentWordCount(state: MyStuffStateModel): number {
        return state.currContentWordCount;
    }
}
