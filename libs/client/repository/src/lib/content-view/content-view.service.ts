import { Injectable } from '@angular/core';
import { ContentViewStore } from './content-view.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentKind, PubContent, SectionInfo } from '@dragonfish/shared/models/content';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentViewQuery } from './content-view.query';
import { AlertsService } from '@dragonfish/client/alerts';
import { Section } from '@dragonfish/shared/models/sections';
import { CommentForm, CommentKind } from '@dragonfish/shared/models/comments';

@Injectable({ providedIn: 'root' })
export class ContentViewService {
    constructor(
        private contentView: ContentViewStore,
        private viewQuery: ContentViewQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public fetchContent(contentId: string, kind: ContentKind, page: number): Observable<PubContent> {
        return this.network.fetchContent(contentId, kind, page).pipe(
            tap((value) => {
                const contentAny = value.content as any;
                let sections = null;
                if (
                    value.content.kind === ContentKind.ProseContent ||
                    value.content.kind === ContentKind.PoetryContent
                ) {
                    sections = contentAny.sections.filter((x) => {
                        return x.published === true;
                    }) as SectionInfo[];
                }
                this.contentView.update({
                    currContent: value.content,
                    allSections: sections,
                    currPage: page,
                    ratingsDoc: value.ratings,
                    currRating: value.ratings && value.ratings.rating ? value.ratings.rating : RatingOption.NoVote,
                    likes: value.content.stats.likes,
                    dislikes: value.content.stats.dislikes,
                });
            }),
        );
    }

    public fetchSection(sectionId: string): Observable<Section> {
        return this.network.fetchSection(sectionId).pipe(
            tap((val) => {
                this.contentView.update({
                    currSection: val,
                });
            }),
        );
    }

    public fetchNextComments(contentId: string, page: number) {
        this.contentView.setLoading(true);
        return this.network.fetchComments(contentId, CommentKind.ContentComment, page).pipe(
            tap((value) => {
                this.contentView.update({ currPageComments: value, currPage: page });
                this.contentView.setLoading(false);
            }),
        );
    }

    public addLike(contentId: string): void {
        switch (this.viewQuery.currRating) {
            case RatingOption.Liked:
                this.alerts.error(`You've already upvoted this content!`);
                return;
            case RatingOption.Disliked:
                this.contentView.update({
                    currRating: RatingOption.Liked,
                    likes: this.viewQuery.likes + 1,
                    dislikes: this.viewQuery.dislikes - 1,
                });
                break;
            case RatingOption.NoVote:
                this.contentView.update({
                    currRating: RatingOption.Liked,
                    likes: this.viewQuery.likes + 1,
                });
                break;
        }

        this.network.addLike(contentId).subscribe((val) => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }

    public addDislike(contentId: string): void {
        switch (this.viewQuery.currRating) {
            case RatingOption.Disliked:
                this.alerts.error(`You've already downvoted this content!`);
                return;
            case RatingOption.Liked:
                this.contentView.update({
                    currRating: RatingOption.Disliked,
                    likes: this.viewQuery.likes - 1,
                    dislikes: this.viewQuery.dislikes + 1,
                });
                break;
            case RatingOption.NoVote:
                this.contentView.update({
                    currRating: RatingOption.Disliked,
                    dislikes: this.viewQuery.dislikes + 1,
                });
                break;
        }

        this.network.addDislike(contentId).subscribe((val) => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }

    public setNoVote(contentId: string): void {
        switch (this.viewQuery.currRating) {
            case RatingOption.Liked:
                this.contentView.update({
                    currRating: RatingOption.NoVote,
                    likes: this.viewQuery.likes - 1,
                });
                break;
            case RatingOption.Disliked:
                this.contentView.update({
                    currRating: RatingOption.NoVote,
                    dislikes: this.viewQuery.dislikes - 1,
                });
                break;
        }

        this.network.removeVote(contentId).subscribe((val) => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }
}
