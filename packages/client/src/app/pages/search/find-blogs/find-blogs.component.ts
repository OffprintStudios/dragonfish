import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentModel } from '@dragonfish/models/content';
import { PaginateResult } from '@dragonfish/models/util';
import { SearchService } from '../../../services/utility';

@Component({
  selector: 'app-find-blogs',
  templateUrl: './find-blogs.component.html',
  styleUrls: ['./find-blogs.component.less']
})
export class FindBlogsComponent implements OnInit {
  results: PaginateResult<ContentModel>;
  query: string;
  pageNum: number = 1;

  constructor(private searchService: SearchService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('query') !== null && params.get('page') === null) {
        this.query = params.get('query');
        this.fetchData(this.query, this.pageNum);
      } else if (params.get('query') !== null && params.get('page') !== null) {
        this.query = params.get('query');
        this.pageNum = +params.get('page');
        this.fetchData(this.query, this.pageNum);
      }
    });
  }

  fetchData(query: string, pageNum: number) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {query: query, page: pageNum}, queryParamsHandling: 'merge'});
    this.searchService.getBlogResults(query, pageNum).subscribe(results => {
      this.results = results;
      this.pageNum = pageNum;
    });
  }
}
