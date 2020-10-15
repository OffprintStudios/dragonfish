import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsService } from '../../services/content';
import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsContentModel } from '@pulp-fiction/models/content';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  posts: PaginateResult<NewsContentModel>
  pageNum = 1;

  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router) {
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void { }

  /**
   * Fetches the current page from the backend.
   * 
   * @param pageNum The current page
   */
  fetchData(pageNum: number) {
    const queryParams = this.route.snapshot.queryParamMap;
    if (queryParams.get('page') !== null) {
      this.pageNum = +queryParams.get('page');
    }

    this.newsService.getNewsFeed(pageNum).subscribe(data => {
      this.posts = data;
    });
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
