import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoetryContent, PoetryForm } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { FrontendUser } from '@pulp-fiction/models/users';
import { ContentPage } from '../../../models/site';
import { AuthService } from '../../../services/auth';

import { Title } from '../../../shared';

@Component({
    selector: 'poetry-page',
    templateUrl: './poetry-page.component.html',
    styleUrls: ['./poetry-page.component.less']
})
export class PoetryPageComponent implements OnInit {
    currentUser: FrontendUser;

    currPoetry: PoetryContent;
    histData: ReadingHistory;
    pageNum = 1;

    poetryForm = PoetryForm;

    constructor(public route: ActivatedRoute, private router: Router, private auth: AuthService) {
        this.auth.currUser.subscribe(x => { this.currentUser = x; })
        this.fetchData();
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            const pageData = data.poetryData as ContentPage;
            console.log(pageData);
            this.currPoetry = pageData.content as PoetryContent;

            if (pageData.history !== null) {
                this.histData = pageData.history;
            }
        });

        Title.setTwoPartTitle(this.currPoetry.title);
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
}