import { Component, HostListener, OnInit } from '@angular/core';
import { WorkPageQuery, WorkPageService } from '@dragonfish/client/repository/work-page';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { isMobile } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.scss'],
})
export class ContentInfoComponent implements OnInit {
    ratingOption = RatingOption;
    likes = 0;
    dislikes = 0;
    mobileMode = false;
    mobileShowDescription = false;
    mobileShowInfo = false;

    constructor(
        public workQuery: WorkPageQuery,
        public workPage: WorkPageService,
        public session: SessionQuery,
        public auth: AuthService,
    ) {}

    ngOnInit(): void {
        this.onResize();
        this.likes = this.workQuery.likes;
        this.dislikes = this.workQuery.dislikes;
    }
    
    addLike(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Liked:
                return;
            case RatingOption.Disliked:
                this.likes = this.likes + 1;
                this.dislikes = this.dislikes - 1;
                break;
            case RatingOption.NoVote:
                this.likes = this.likes + 1;
                break;
        }

        this.workPage.addLike(contentId);
    }

    addDislike(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Disliked:
                return;
            case RatingOption.Liked:
                this.likes = this.likes - 1;
                this.dislikes = this.dislikes + 1;
                break;
            case RatingOption.NoVote:
                this.dislikes = this.dislikes + 1;
                break;
        }

        this.workPage.addDislike(contentId);
    }

    setNoVote(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Liked:
                this.likes = this.likes - 1;
                break;
            case RatingOption.Disliked:
                this.dislikes = this.dislikes - 1;
                break;
        }
        
        this.workPage.setNoVote(contentId);
    }

    toggleShowDescription() {
        this.mobileShowDescription = !this.mobileShowDescription;
    }

    toggleShowInfo() {
        this.mobileShowInfo = !this.mobileShowInfo;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
