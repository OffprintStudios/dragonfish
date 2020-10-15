import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';

import { FrontendUser } from '@pulp-fiction/models/users';
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

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; })
  }

  ngOnInit(): void {
    this.currPost = this.route.snapshot.data.postData as NewsContentModel;
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
