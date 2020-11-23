import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../../services/auth';
import { BlogsService, PortfolioService } from '../../../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog } from '@pulp-fiction/models/blogs';
import { ItemKind } from '@pulp-fiction/models/comments';

import { Title } from '../../../shared';
import { BlogsContentModel } from '@pulp-fiction/models/content';

@Component({
  selector: 'app-port-blog-page',
  templateUrl: './port-blog-page.component.html',
  styleUrls: ['./port-blog-page.component.less']
})
export class PortBlogPageComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUserName: string; // The username for this portfolio
  blogData: BlogsContentModel; // The blog we're displaying
  loading = false; // Loading check for fetching data
  pageNum = 1; // Comments page
  itemKind = ItemKind.Blog;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
    const params = this.route.parent.snapshot.paramMap;
    this.portUserName = params.get('username');
    this.blogData = this.route.snapshot.data.blogData as BlogsContentModel;
    Title.setTwoPartTitle(this.blogData.title);
  }

  /**
   * Fetches the blog from the backend.
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
