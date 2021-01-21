import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../shared/user';

import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { ItemKind } from '@pulp-fiction/models/comments';
import { ContentPage } from '../../models/site';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

@Component({
  selector: 'pulp-fiction-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit {
  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  currPost: NewsContentModel;
  histData: ReadingHistory;
  category = NewsCategory;

  pageNum = 1; // For comments pages
  itemKind = ItemKind.NewsContent; // Sets the item kind for comments

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    this.fetchData();
  }

  ngOnInit(): void {
    this.currPost = this.route.snapshot.data.postData as NewsContentModel;

    this.route.data.subscribe(data => {
      const pageData = data.postData as ContentPage;
      this.currPost = pageData.content as NewsContentModel;
      if (pageData.history !== null) {
        this.histData = pageData.history;
      }
    })
  }

  private fetchData() {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('page') !== null) {
      this.pageNum = +queryParams.get('page');
    }
  }

  /**
   * Handles page changing
   * 
   * @param event The new page
   */
  onPageChange(event: number) {
    if (event !== 1) {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate([], {relativeTo: this.route});
    }
  }
}
