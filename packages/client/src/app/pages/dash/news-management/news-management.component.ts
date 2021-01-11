import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsContentModel, PubStatus } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { NewsManagementService } from './news-management.service';

@Component({
    selector: 'news-management',
    templateUrl: './news-management.component.html',
    styleUrls: ['./news-management.component.less']
})
export class NewsManagementComponent implements OnInit {
    currentUser: FrontendUser;

    posts: PaginateResult<NewsContentModel>;
    pubStatus = PubStatus;
    pageNum: number = 1;

    constructor(private newsService: NewsManagementService, private auth: AuthService, public route: ActivatedRoute, private router: Router) {
        this.auth.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.posts = data.newsData as PaginateResult<NewsContentModel>;
        });
    }

    /**
     * Handles page changing
     * 
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        this.pageNum = event;
    }

    setPublishStatus(postId: string, pubStatus: PubStatus) {
        if (pubStatus === PubStatus.Published) {
            this.newsService.setPublishStatus(postId, PubStatus.Unpublished).subscribe(() => {
                this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
            });
        } else if (pubStatus === PubStatus.Unpublished) {
            this.newsService.setPublishStatus(postId, PubStatus.Published).subscribe(() => {
                this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
            })
        }
    }
}