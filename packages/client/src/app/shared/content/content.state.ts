import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { Observable, zip, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Content } from './content.actions';
import { ContentStateModel } from './content-state.model';
import { ContentService } from './services';
import { ContentKind, ContentModel, SectionInfo } from '@pulp-fiction/models/content';
import { RatingOption } from '@pulp-fiction/models/reading-history';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { FrontendUser } from '@pulp-fiction/models/users';
import { UserState } from '../user';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Section } from '@pulp-fiction/models/sections';

/**
 * ## ContentState
 * 
 * Actions related to **published** content being fetched for display. Does not
 * deal with unpublished content, content creation, and the display of such items.
 */
@State<ContentStateModel>({
    name: 'content',
    defaults: {
        currPageContent: null,
        currContent: null,
        currHistDoc: null,
        currSections: null,
        currSection: null,
        likes: 0,
        dislikes: 0
    }
})
@Injectable()
export class ContentState {
    constructor (private contentService: ContentService, private snackBar: MatSnackBar, private store: Store) {}

    /* Actions */

    @Action(Content.FetchOne)
    fetchOne({ patchState, dispatch }: StateContext<ContentStateModel>, { contentId, kind }: Content.FetchOne): Observable<[ContentModel, any]> {
        const currUser: FrontendUser | null = this.store.selectSnapshot(UserState.currUser);
        const thisContent = this.contentService.fetchOne(contentId, kind).pipe(tap((val: ContentModel) => {
            if (val.kind === ContentKind.PoetryContent || val.kind === ContentKind.ProseContent) {
                const anyContent = val as any;
                const theseSections = anyContent.sections as SectionInfo[];
                dispatch(new Content.SetSections(theseSections));
            }
        }));

        if (currUser !== null) {
            const thisHistory = this.contentService.fetchRelatedHistory(contentId);

            return zip(thisContent, thisHistory).pipe(tap((val: [ContentModel, ReadingHistory]) => {
                patchState({
                    currContent: val[0],
                    currHistDoc: val[1],
                    likes: val[0].stats.likes,
                    dislikes: val[0].stats.dislikes
                });
            }));
        } else {
            return zip(thisContent, of(null)).pipe(tap((val: [ContentModel, any]) => {
                patchState({
                    currContent: val[0],
                    currHistDoc: val[1],
                    likes: val[0].stats.likes,
                    dislikes: val[0].stats.dislikes
                });
            }));
        }
    }

    @Action(Content.FetchAll)
    fetchAll({ patchState }: StateContext<ContentStateModel>, { pageNum, kinds, userId }: Content.FetchAll) {
        return this.contentService.fetchAll(pageNum, kinds, userId).pipe(tap((val: PaginateResult<ContentModel>) => {
            patchState({
                currPageContent: val
            });
        }));
    }

    @Action(Content.SetSections)
    setSections({ patchState }: StateContext<ContentStateModel>, { sections }: Content.SetSections): void {
        patchState({
            currSections: sections.filter(x => {return x.published === true}) as SectionInfo[]
        });
    }

    @Action(Content.FetchSection)
    fetchSection({ patchState }: StateContext<ContentStateModel>, { sectionId }: Content.FetchSection) {
        return this.contentService.fetchSection(sectionId).pipe(tap((val: Section) => {
            patchState({
                currSection: val
            });
        }));
    }

    @Action(Content.SetLike)
    setLike({ dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetLike) {
        return this.contentService.setLike(setRating).pipe(tap((_val: void) => {
            if (setRating.oldApprovalRating === RatingOption.Disliked) {
                dispatch(new Content.IncrementLikes());
                dispatch(new Content.DecrementDislikes());
            } else {
                dispatch(new Content.IncrementLikes());
            }
        }));
    }

    @Action(Content.SetDislike)
    setDislike({ dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetDislike) {
        return this.contentService.setDislike(setRating).pipe(tap((_val: void) => {
            if (setRating.oldApprovalRating === RatingOption.Liked) {
                dispatch(new Content.IncrementDislikes());
                dispatch(new Content.DecrementLikes());
            } else {
                dispatch(new Content.IncrementDislikes());
            }
        }));
    }

    @Action(Content.SetNoVote)
    setNoVote({ dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetNoVote) {
        return this.contentService.setNoVote(setRating).pipe(tap((_val: void) => {
            if (setRating.oldApprovalRating === RatingOption.Liked) {
                dispatch(new Content.DecrementLikes());
            } else if (setRating.oldApprovalRating === RatingOption.Disliked) {
                dispatch(new Content.DecrementDislikes());
            }
        }));
    }

    @Action(Content.IncrementLikes)
    incrementLikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            likes: getState().likes + 1
        });
    }

    @Action(Content.DecrementLikes)
    decrementLikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            likes: getState().likes - 1
        });
    }

    @Action(Content.IncrementDislikes)
    incrementDislikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            dislikes: getState().dislikes + 1
        });
    }

    @Action(Content.DecrementDislikes)
    decrementDislikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            dislikes: getState().dislikes - 1
        });
    }

    /* Selectors */

    @Selector()
    static currPageContent(state: ContentStateModel): PaginateResult<ContentModel> {
        return state.currPageContent;
    }

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

    @Selector()
    static currSection(state: ContentStateModel): Section {
        return state.currSection;
    }

    @Selector()
    static likes(state: ContentStateModel): number {
        return state.likes;
    }

    @Selector()
    static dislikes(state: ContentStateModel): number {
        return state.dislikes;
    }
}