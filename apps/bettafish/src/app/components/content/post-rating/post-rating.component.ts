import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { ContentModel, SetRating } from '@dragonfish/shared/models/content';
import { RatingOption, ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { UserState } from '../../../repo/user';
import { ContentState } from '../../../repo/content';
import { ContentService } from '../../../repo/content/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-post-rating',
    templateUrl: './post-rating.component.html',
    styleUrls: ['./post-rating.component.scss'],
})
export class PostRatingComponent {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    @Select(ContentState.currContent) currContent$: Observable<ContentModel>;
    @Select(ContentState.currHistDoc) currHistDoc$: Observable<ReadingHistory>;
    @Select(ContentState.likes) likes$: Observable<number>;
    @Select(ContentState.dislikes) dislikes$: Observable<number>;

    ratingOption = RatingOption;
    optionsIsOpen = false;

    constructor(private content: ContentService) {}

    /**
     * Sets this user's rating as Liked.
     *
     * @param contentId The content ID
     * @param currRating The current rating
     */
    setLike(contentId: string, currRating: RatingOption) {
        const ratingOptions: SetRating = {
            workId: contentId,
            oldApprovalRating: currRating,
        };

        this.content.setLike(ratingOptions);
    }

    /**
     * Sets this user's rating as Disliked.
     *
     * @param contentId The content ID
     * @param currRating The current rating
     */
    setDislike(contentId: string, currRating: RatingOption) {
        const ratingOptions: SetRating = {
            workId: contentId,
            oldApprovalRating: currRating,
        };

        this.content.setDislike(ratingOptions);
    }

    /**
     * Sets this user's rating as NoVote.
     *
     * @param contentId The content ID
     * @param currRating The current rating
     */
    setNoVote(contentId: string, currRating: RatingOption) {
        const ratingOptions: SetRating = {
            workId: contentId,
            oldApprovalRating: currRating,
        };

        this.content.setNoVote(ratingOptions);
    }
}
