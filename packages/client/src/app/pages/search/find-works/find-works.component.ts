import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Work } from '@pulp-fiction/models/works';
import { PaginateResult } from '@pulp-fiction/models/util';
import { SearchService } from '../../../services/utility';
import { calculateApprovalRating } from '../../../util/functions';

@Component({
  selector: 'app-find-works',
  templateUrl: './find-works.component.html',
  styleUrls: ['./find-works.component.less']
})
export class FindWorksComponent implements OnInit {
  results: PaginateResult<Work>;
  query: string;
  pageNum = 1;
  constructor(private searchService: SearchService, public route: ActivatedRoute, private router: Router) {}

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
    this.searchService.getWorkResults(query, pageNum).subscribe(results => {
      this.results = results;
      this.pageNum = pageNum;
    });
  }

  /**
   * Calculates a work's approval rating.
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }
}
