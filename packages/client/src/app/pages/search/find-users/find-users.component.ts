import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@dragonfish/models/users';
import { PaginateResult } from '@dragonfish/models/util';
import { SearchService } from '../../../services/utility';

@Component({
  selector: 'app-find-users',
  templateUrl: './find-users.component.html',
  styleUrls: ['./find-users.component.less']
})
export class FindUsersComponent implements OnInit {
  results: PaginateResult<User>;
  query: string
  pageNum = 1;

  constructor(private searchService: SearchService, public route: ActivatedRoute, private router: Router) {}

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
    this.searchService.getUserResults(query, pageNum).subscribe(results => {
      this.results = results;
      this.pageNum = pageNum;
    });
  }
}
