import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';

import { FrontendUser } from '@pulp-fiction/models/users';
import { ItemKind } from '@pulp-fiction/models/comments';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'pulp-fiction-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit {
  currentUser: FrontendUser;

  currPost: NewsContentModel;
  category = NewsCategory;

  pageNum = 1; // For comments pages
  itemKind = ItemKind.Content; // Sets the item kind for comments

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; })
    this.fetchData();
  }

  ngOnInit(): void {
    this.currPost = this.route.snapshot.data.postData as NewsContentModel;
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
