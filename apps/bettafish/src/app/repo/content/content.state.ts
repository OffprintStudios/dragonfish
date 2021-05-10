import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { Observable, zip, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ContentFilter, ContentKind, ContentModel, SectionInfo } from '@dragonfish/shared/models/content';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { Section } from '@dragonfish/shared/models/sections';

import * as Content from './content.actions';
import { ContentStateModel } from './content-state.model';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { UserState } from '../user';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { GlobalState } from '../global';
import { AlertsService } from '@dragonfish/client/alerts';

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
        dislikes: 0,
    },
})
@Injectable()
export class ContentState {
    @SelectSnapshot(GlobalState.filter) filter: ContentFilter;

    constructor(private networkService: DragonfishNetworkService, private store: Store, private alerts: AlertsService) { }

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

    /* Actions */

    @Action(Content.FetchOne)
    fetchOne(
        { patchState, dispatch }: StateContext<ContentStateModel>,
        { contentId, kind }: Content.FetchOne,
    ): Observable<[ContentModel, any]> {
        const currUser: FrontendUser | null = this.store.selectSnapshot(UserState.currUser);
        const thisContent = this.networkService.fetchContent(contentId, kind).pipe(
            tap((val: ContentModel) => {
                if (val.kind === ContentKind.PoetryContent || val.kind === ContentKind.ProseContent) {
                    const anyContent = val as any;
                    const theseSections = anyContent.sections as SectionInfo[];
                    dispatch(new Content.SetSections(theseSections));
                }
            }),
        );

        if (currUser !== null) {
            const thisHistory = this.networkService.fetchRelatedHistory(contentId);

            return zip(thisContent, thisHistory).pipe(
                tap((val: [ContentModel, ReadingHistory]) => {
                    patchState({
                        currContent: val[0],
                        currHistDoc: val[1],
                        likes: val[0].stats.likes,
                        dislikes: val[0].stats.dislikes,
                    });
                }),
            );
        } else {
            return zip(thisContent, of(null)).pipe(
                tap((val: [ContentModel, any]) => {
                    patchState({
                        currContent: val[0],
                        currHistDoc: val[1],
                        likes: val[0].stats.likes,
                        dislikes: val[0].stats.dislikes,
                    });
                }),
            );
        }
    }

    @Action(Content.FetchAll)
    fetchAll({ patchState }: StateContext<ContentStateModel>, { pageNum, kinds, userId }: Content.FetchAll) {
        return this.networkService.fetchAllContent(pageNum, kinds, this.filter, userId).pipe(
            tap((val: PaginateResult<ContentModel>) => {
                patchState({
                    currPageContent: val,
                });
            }),
        );
    }

    @Action(Content.SetSections)
    setSections({ patchState }: StateContext<ContentStateModel>, { sections }: Content.SetSections): void {
        patchState({
            currSections: sections.filter((x) => {
                return x.published === true;
            }) as SectionInfo[],
        });
    }

    @Action(Content.FetchSection)
    fetchSection({ patchState }: StateContext<ContentStateModel>, { sectionId }: Content.FetchSection) {
        return this.networkService.fetchSection(sectionId).pipe(
            tap((val: Section) => {
                patchState({
                    currSection: val,
                });
            }),
        );
    }

    @Action(Content.SetLike)
    setLike({ patchState, dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetLike) {
        if (setRating.oldApprovalRating === RatingOption.Disliked) {
            return this.networkService.setLike(setRating).pipe(
                tap((val: ReadingHistory) => {
                    dispatch(new Content.IncrementLikes());
                    dispatch(new Content.DecrementDislikes());
                    patchState({
                        currHistDoc: val,
                    });
                }),
            );
        } else if (setRating.oldApprovalRating === RatingOption.Liked) {
            this.alerts.error(`You've already upvoted this content!`);
            return;
        } else {
            return this.networkService.setLike(setRating).pipe(
                tap((val: ReadingHistory) => {
                    dispatch(new Content.IncrementLikes());
                    patchState({
                        currHistDoc: val,
                    });
                }),
            );
        }
    }

    @Action(Content.SetDislike)
    setDislike({ patchState, dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetDislike) {
        if (setRating.oldApprovalRating === RatingOption.Liked) {
            return this.networkService.setDislike(setRating).pipe(
                tap((val: ReadingHistory) => {
                    dispatch(new Content.IncrementDislikes());
                    dispatch(new Content.DecrementLikes());
                    patchState({
                        currHistDoc: val,
                    });
                }),
            );
        } else if (setRating.oldApprovalRating === RatingOption.Disliked) {
            this.alerts.error(`You've already downvoted this content!`);
            return;
        } else {
            return this.networkService.setDislike(setRating).pipe(
                tap((val: ReadingHistory) => {
                    dispatch(new Content.IncrementDislikes());
                    patchState({
                        currHistDoc: val,
                    });
                }),
            );
        }
    }

    @Action(Content.SetNoVote)
    setNoVote({ patchState, dispatch }: StateContext<ContentStateModel>, { setRating }: Content.SetNoVote) {
        return this.networkService.setNoVote(setRating).pipe(
            tap((val: ReadingHistory) => {
                if (setRating.oldApprovalRating === RatingOption.Liked) {
                    dispatch(new Content.DecrementLikes());
                } else if (setRating.oldApprovalRating === RatingOption.Disliked) {
                    dispatch(new Content.DecrementDislikes());
                }
                patchState({
                    currHistDoc: val,
                });
            }),
        );
    }

    @Action(Content.IncrementLikes)
    incrementLikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            likes: getState().likes + 1,
        });
    }

    @Action(Content.DecrementLikes)
    decrementLikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            likes: getState().likes - 1,
        });
    }

    @Action(Content.IncrementDislikes)
    incrementDislikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            dislikes: getState().dislikes + 1,
        });
    }

    @Action(Content.DecrementDislikes)
    decrementDislikes({ getState, patchState }: StateContext<ContentStateModel>) {
        patchState({
            dislikes: getState().dislikes - 1,
        });
    }
}
