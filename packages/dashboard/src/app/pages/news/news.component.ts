import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { FrontendUser } from '@pulp-fiction/models/users';
import { NewsContentModel, PubStatus } from '@pulp-fiction/models/content';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../services/auth';
import { NewsService } from '../../services/contrib/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  currentUser: FrontendUser;

  posts: PaginateResult<NewsContentModel>;
  pubStatus = PubStatus;
  pageNum: number = 1;

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  constructor(private newsService: NewsService, private authService: AuthService, public route: ActivatedRoute, private router: Router) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
    
    this.router.events.pipe(filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/news'))
      .subscribe(() => { this.fetchData(this.pageNum) });
  }

  ngOnInit(): void {}

  /**
   * Fetches data for the current page of results.
   * 
   * @param pageNum The current page
   */
  fetchData(pageNum: number) {
    this.newsService.fetchAll(pageNum).subscribe(data => {
      this.posts = data;
    });
  }

  /**
   * Changes a post's publishing status.
   * 
   * @param postId The post ID
   * @param pubStatus The new pubStatus
   */
  setPublishStatus(postId: string, pubStatus: PubStatus) {
    if (pubStatus === PubStatus.Published) {
      this.newsService.setPublishStatus(postId, PubStatus.Unpublished).subscribe(() => {
        this.fetchData(this.pageNum);
      });
    } else if (pubStatus === PubStatus.Unpublished) {
      this.newsService.setPublishStatus(postId, PubStatus.Published).subscribe(() => {
        this.fetchData(this.pageNum);
      })
    }
  }
}
