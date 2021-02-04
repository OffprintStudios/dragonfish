import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';
import { ContentState } from '../../../shared/content';
import { Title } from '../../../shared/title';

import { NewsCategory, NewsContentModel } from '@dragonfish/models/content';
import { FrontendUser } from '@dragonfish/models/users';
import { ItemKind } from '@dragonfish/models/comments';

@Component({
  selector: 'dragonfish-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit {
  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  @Select(ContentState.currContent) currContent$: Observable<NewsContentModel>;
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
    this.currContent$.subscribe(x => {
      Title.setTwoPartTitle(x.title);
    });
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
