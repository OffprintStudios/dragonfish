import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../../shared/user';

import { FrontendUser } from '@dragonfish/models/users';
import { Title } from '../../../../shared';
import { BlogsContentModel } from '@dragonfish/models/content';
import { ContentState } from 'packages/client/src/app/shared/content';

@Component({
  selector: 'blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.less']
})
export class BlogPageComponent implements OnInit {
  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  @Select(ContentState.currContent) currContent$: Observable<BlogsContentModel>;

  loading = false; // Loading check for fetching data
  pageNum = 1; // Comments page

  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    this.fetchData();
  }

  ngOnInit(): void {
    this.currContent$.subscribe(x => {
      Title.setTwoPartTitle(x.title);
    });
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
