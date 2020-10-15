import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginateResult } from '@pulp-fiction/models/util';
import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';
import { Constants, Title } from '../../shared';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  posts: PaginateResult<NewsContentModel>
  pageNum = 1;
  category = NewsCategory;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.posts = data.feedData;
      console.log(this.posts);
    });
    Title.setTwoPartTitle(Constants.NEWS);
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
}
