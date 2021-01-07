import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProseContent, SectionInfo, WorkStatus } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { FrontendUser } from '@pulp-fiction/models/users';
import { ContentPage } from '../../../models/site';
import { AuthService } from '../../../services/auth';

import { Title } from '../../../shared';

@Component({
    selector: 'prose-page',
    templateUrl: './prose-page.component.html',
    styleUrls: ['./prose-page.component.less']
})
export class ProsePageComponent implements OnInit {
    currentUser: FrontendUser;

    currProse: ProseContent;
    histData: ReadingHistory;
    pageNum = 1;
    ratingSize = 'large';

    contentStatus = WorkStatus;

    constructor(public route: ActivatedRoute, private router: Router, private auth: AuthService) {
            this.auth.currUser.subscribe(x => { this.currentUser = x; });
            this.onResize()
            this.fetchData();
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            const pageData = data.proseData as ContentPage;
            this.currProse = pageData.content as ProseContent;
            
            if (pageData.history !== null) {
                this.histData = pageData.history;
            }
        });

        Title.setTwoPartTitle(this.currProse.title);
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