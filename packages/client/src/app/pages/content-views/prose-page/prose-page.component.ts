import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';
import { ContentState } from '../../../shared/content';

import { Genres, ProseContent, SectionInfo, WorkStatus } from '@dragonfish/models/content';
import { FrontendUser } from '@dragonfish/models/users';

import { Title } from '../../../shared';


@Component({
    selector: 'prose-page',
    templateUrl: './prose-page.component.html',
    styleUrls: ['./prose-page.component.less']
})
export class ProsePageComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    @Select(ContentState.currContent) currContent$: Observable<ProseContent>;

    pageNum = 1;
    ratingSize = 'large';

    contentStatus = WorkStatus;
    contentGenres = Genres;

    constructor(public route: ActivatedRoute, private router: Router) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
        this.onResize()
        this.fetchData();
    }

    ngOnInit(): void {
        this.currContent$.subscribe(x => {
            Title.setTwoPartTitle(x.title);
        });
    }

    /**
     * Changes the size of the rating icon depending on the size of the window.
     * 
     * @param event Window resize event
     */
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        if (window.innerWidth < 1000) {
            this.ratingSize = 'small';
        } else {
            this.ratingSize = 'large';
        }
    }

    /**
     * Fetches the current page of comments.
     */
    private fetchData() {
        const queryParams = this.route.snapshot.queryParamMap;    
        if (queryParams.get('page') !== null) {
            this.pageNum = +queryParams.get('page');
        }
    }

    
    /**
     * Changes query params to the appropriate page.
     * @param event The page changed to
     */
    onPageChange(event: number) {
        if (event !== 1) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        } else {
        this.router.navigate([], {relativeTo: this.route});
        }
    }

    /**
     * Old prose won't have a publishedOn value, so createdAt is used instead
     * @param section 
     */
    getPublishedDate(section: SectionInfo): Date {
        if (section.audit.publishedOn === null) {
            return section.createdAt;
        }
        return section.audit.publishedOn;
    }
}