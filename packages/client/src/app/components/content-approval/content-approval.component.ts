import { Component, Input, OnInit } from '@angular/core';
import { ReadingHistory, RatingOption } from '@pulp-fiction/models/reading-history';
import { SetRating } from '@pulp-fiction/models/content';
import { ContentService, HistoryService } from '../../services/content';
import { AuthService } from '../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
    selector: 'content-approval',
    templateUrl: './content-approval.component.html',
    styleUrls: ['./content-approval.component.less']
})
export class ContentApprovalComponent implements OnInit {
    @Input() content: any;
    @Input() histData: ReadingHistory;

    currentUser: FrontendUser;

    constructor(private contentService: ContentService, private auth: AuthService) {
        this.auth.currUser.subscribe(x => { this.currentUser = x; })
    }

    ngOnInit(): void {}

    /**
     * Sets this user's rating as Liked.
     * 
     * @param contentId The content ID
     * @param currRating The current rating
     */
    setLike(contentId: string, currRating: RatingOption) {
        const ratingOptions: SetRating = {
            workId: contentId,
            oldApprovalRating: currRating
        };

        this.contentService.setLike(ratingOptions).subscribe(() => {
            this.histData.ratingOption = RatingOption.Liked;
            if (currRating === RatingOption.Disliked) {
                this.content.stats.dislikes -= 1;
            } else {
                this.content.stats.likes += 1;
            }
        });
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
            oldApprovalRating: currRating
        };

        this.contentService.setDislike(ratingOptions).subscribe(() => {
            this.histData.ratingOption = RatingOption.Disliked;
            if (currRating === RatingOption.Liked) {
                this.content.stats.likes -= 1;
            } else {
                this.content.stats.dislikes += 1;
            }
        });
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
            oldApprovalRating: currRating
        };

        this.contentService.setNoVote(ratingOptions).subscribe(() => {
            this.histData.ratingOption = RatingOption.NoVote;
            if (currRating === RatingOption.Liked) {
                this.content.stats.likes -= 1;
            } else if (currRating === RatingOption.Disliked) {
                this.content.stats.dislikes -= 1;
            }
        });
    }
}