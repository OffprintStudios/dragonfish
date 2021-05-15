import { Component } from '@angular/core';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';

@Component({
    selector: 'dragonfish-news-rating',
    templateUrl: './news-rating.component.html',
    styleUrls: ['./news-rating.component.scss']
})
export class NewsRatingComponent {
    ratingOption = RatingOption;
    optionsIsOpen = false;

    constructor(private viewService: ContentViewService, public viewQuery: ContentViewQuery) {}

    /**
     * Sets this user's rating as Liked.
     *
     * @param contentId The content ID
     */
    setLike(contentId: string) {
        this.viewService.addLike(contentId);
    }

    /**
     * Sets this user's rating as Disliked.
     *
     * @param contentId The content ID
     */
    setDislike(contentId: string) {
        this.viewService.addDislike(contentId);
    }

    /**
     * Sets this user's rating as NoVote.
     *
     * @param contentId The content ID
     */
    setNoVote(contentId: string) {
        this.viewService.setNoVote(contentId);
    }
}
