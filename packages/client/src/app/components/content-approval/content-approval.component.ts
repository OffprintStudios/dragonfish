import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../shared/user';

import { ReadingHistory, RatingOption } from '@dragonfish/models/reading-history';
import { ContentKind, ContentModel, SetRating } from '@dragonfish/models/content';
import { FrontendUser } from '@dragonfish/models/users';

import { AddToCollectionComponent } from '../modals/collections';
import { Content, ContentState } from '../../shared/content';

@Component({
    selector: 'content-approval',
    templateUrl: './content-approval.component.html',
    styleUrls: ['./content-approval.component.less']
})
export class ContentApprovalComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    @Select(ContentState.currContent) currContent$: Observable<ContentModel>;
    @Select(ContentState.currHistDoc) currHistDoc$: Observable<ReadingHistory>;
    @Select(ContentState.likes) likes$: Observable<number>;
    @Select(ContentState.dislikes) dislikes$: Observable<number>;

    contentKind = ContentKind;
    ratingOption = RatingOption;

    constructor(private store: Store, private dialog: MatDialog) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
    }

    /**
     * Opens the Add To Collection dialog box.
     */
    openAddToCollectionDialog(content: ContentModel) {
        const dialogRef = this.dialog.open(AddToCollectionComponent, {data: {content: content}});
    }

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

        this.store.dispatch(new Content.SetLike(ratingOptions)).subscribe();
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

        this.store.dispatch(new Content.SetDislike(ratingOptions)).subscribe();
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

        this.store.dispatch(new Content.SetNoVote(ratingOptions)).subscribe();
    }
}