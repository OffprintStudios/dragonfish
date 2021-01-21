import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { Observable, zip, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Content } from './content.actions';
import { ContentStateModel } from './content-state.model';
import { ContentService } from './services';
import { ContentKind, ContentModel, SectionInfo } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { FrontendUser } from '@pulp-fiction/models/users';
import { UserState } from '../user';

/**
 * ## ContentState
 * 
 * Actions related to **published** content being fetched for display. Does not
 * deal with unpublished content, content creation, and the display of such items.
 */
@State<ContentStateModel>({
    name: 'content',
    defaults: {
        currContent: null,
        currHistDoc: null,
        currSections: null
    }
})
@Injectable()
export class ContentState {
    constructor (private contentService: ContentService, private snackBar: MatSnackBar, private store: Store) {}

    /* Actions */

    @Action(Content.FetchOne)
    fetchOne({ patchState, dispatch }: StateContext<ContentStateModel>, { contentId, kind }: Content.FetchOne): Observable<[ContentModel, any]> {
        const currUser: FrontendUser | null = this.store.selectSnapshot(UserState.currUser);
        const thisContent = this.contentService.fetchOne(contentId, kind).pipe(tap(val => {
            if (val.kind === ContentKind.PoetryContent || val.kind === ContentKind.ProseContent) {
                const anyContent = val as any;
                const theseSections = anyContent.sections as SectionInfo[];
                dispatch(new Content.SetSections(theseSections));
            }
        }));

        if (currUser !== null) {
            const thisHistory = this.contentService.fetchRelatedHistory(contentId);

            return zip(thisContent, thisHistory).pipe(tap(val => {
                patchState({
                    currContent: val[0],
                    currHistDoc: val[1]
                });
            }));
        } else {
            return zip(thisContent, of(null)).pipe(tap(val => {
                patchState({
                    currContent: val[0],
                    currHistDoc: val[1]
                });
            }));
        }
    }

    @Action(Content.FetchAll)
    fetchAll() {

    }

    @Action(Content.SetSections)
    setSections({ patchState }: StateContext<ContentStateModel>, { sections }: Content.SetSections): void {
        patchState({
            currSections: sections.filter(x => {return x.published === true}) as SectionInfo[]
        });
    }

    @Action(Content.FetchSection)
    fetchSection() {

    }

    @Action(Content.SetLike)
    setLike() {

    }

    @Action(Content.SetDislike)
    setDislike() {

    }

    @Action(Content.SetNoVote)
    setNoVote() {

    }

    /* Selectors */

    @Selector()
    static currContent(state: ContentStateModel): ContentModel {
        return state.currContent;
    }

    @Selector()
    static currHistDoc(state: ContentStateModel): ReadingHistory {
        return state.currHistDoc;
    }

    @Selector()
    static currSections(state: ContentStateModel): SectionInfo[] {
        return state.currSections;
    }
}