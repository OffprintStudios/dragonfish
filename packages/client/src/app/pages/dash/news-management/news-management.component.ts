import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';

import { NewsContentModel, PubStatus } from '@dragonfish/models/content';
import { FrontendUser } from '@dragonfish/models/users';
import { PaginateResult } from '@dragonfish/models/util';
import { NetworkService } from '../../../services';

@Component({
    selector: 'news-management',
    templateUrl: './news-management.component.html',
    styleUrls: ['./news-management.component.less'],
})
export class NewsManagementComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    posts: PaginateResult<NewsContentModel>;
    pubStatus = PubStatus;
    pageNum: number = 1;

    constructor(private networkService: NetworkService, public route: ActivatedRoute, private router: Router) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.posts = data.newsData as PaginateResult<NewsContentModel>;
        });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
        this.pageNum = event;
    }

    setPublishStatus(postId: string, pubStatus: PubStatus) {
        if (pubStatus === PubStatus.Published) {
            this.networkService.setNewspostPublishStatus(postId, PubStatus.Unpublished).subscribe(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        } else if (pubStatus === PubStatus.Unpublished) {
            this.networkService.setNewspostPublishStatus(postId, PubStatus.Published).subscribe(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        }
    }
}
