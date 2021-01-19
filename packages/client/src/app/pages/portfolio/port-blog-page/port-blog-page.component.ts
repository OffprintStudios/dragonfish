import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Title } from '../../../shared';
import { BlogsContentModel } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { ContentPage } from '../../../models/site';

@Component({
  selector: 'app-port-blog-page',
  templateUrl: './port-blog-page.component.html',
  styleUrls: ['./port-blog-page.component.less']
})
export class PortBlogPageComponent implements OnInit {
  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  portUserName: string; // The username for this portfolio
  blogData: BlogsContentModel; // The blog we're displaying
  histData: ReadingHistory; // The current user's reading history
  loading = false; // Loading check for fetching data
  pageNum = 1; // Comments page

  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    this.fetchData();
  }

  ngOnInit(): void {
    const params = this.route.parent.snapshot.paramMap;
    this.portUserName = params.get('username');
    this.route.data.subscribe(data => {
      const pageData = data.blogData as ContentPage;
      this.blogData = pageData.content as BlogsContentModel;
      if (pageData.history !== null) {
        this.histData = pageData.history;
      }
    });
    Title.setTwoPartTitle(this.blogData.title);
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
