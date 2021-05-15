import { Injectable } from '@angular/core';
import { ContentViewStore } from './content-view.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { UserState } from '@dragonfish/client/repository/user';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { ContentKind, SectionInfo } from '@dragonfish/shared/models/content';
import { of, zip } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentViewQuery } from './content-view.query';
import { AlertsService } from '@dragonfish/client/alerts';

@Injectable({ providedIn: 'root' })
export class ContentViewService {
    @SelectSnapshot(UserState.currUser) private currUser: FrontendUser;

    constructor(
        private contentView: ContentViewStore,
        private viewQuery: ContentViewQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public fetchContent(contentId: string, kind: ContentKind) {
        const thisContent$ = this.network.fetchContent(contentId, kind);
        let thisRatingsDoc$ = of(null);
        if (this.currUser !== null && this.currUser !== undefined) {
            thisRatingsDoc$ = this.network.addOrFetchRatings(contentId);
        }

        return zip(thisContent$, thisRatingsDoc$).pipe(tap(value => {
            const [content, ratings] = value;
            const contentAny = content as any;
            let sections = null;
            if (content.kind === ContentKind.ProseContent || content.kind === ContentKind.PoetryContent) {
                sections = contentAny.sections as SectionInfo[];
            }
            this.contentView.update({
                currContent: content,
                allSections: sections,
                ratingsDoc: ratings,
                currRating: ratings.rating ? ratings.rating : RatingOption.NoVote,
                likes: content.stats.likes,
                dislikes: content.stats.dislikes,
            });
        }));
    }

    public addLike(contentId: string) {
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

        this.network.addLike(contentId).subscribe(val => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }

    public addDislike(contentId: string) {
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

        this.network.addDislike(contentId).subscribe(val => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }

    public setNoVote(contentId: string) {
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

        this.network.removeVote(contentId).subscribe(val => {
            this.contentView.update({
                ratingsDoc: val,
                currRating: val.rating,
            });
        });
    }
}
