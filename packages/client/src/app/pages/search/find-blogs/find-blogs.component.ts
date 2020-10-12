import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Blog } from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';
import { SearchService } from '../../../services/utility';

@Component({
  selector: 'app-find-blogs',
  templateUrl: './find-blogs.component.html',
  styleUrls: ['./find-blogs.component.less']
})
export class FindBlogsComponent implements OnInit {
  results: PaginateResult<Blog>;
  query: string;
  pageNum: number = 1;

  constructor(private searchService: SearchService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('query') !== null && queryParams.get('page') === null) {
      this.query = queryParams.get('query');
      this.fetchData(this.query, this.pageNum);
    } else if (queryParams.get('query') !== null && queryParams.get('page') !== null) {
      this.query = queryParams.get('query');
      this.pageNum = +queryParams.get('page');
      this.fetchData(this.query, this.pageNum);
    }
  }

  fetchData(query: string, pageNum: number) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {query: query, page: pageNum}, queryParamsHandling: 'merge'});
    this.searchService.getBlogResults(query, pageNum).subscribe(results => {
      this.results = results;
      this.pageNum = pageNum;
    });
  }
}
