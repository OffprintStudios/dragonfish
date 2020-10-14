import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { calculateApprovalRating } from '../../util/functions';
import { SearchService } from '../../services/utility';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InitialResults } from '../../services/utility/models';

import { GlobalConstants } from '../../shared';
import { GlobalMethods } from '../../shared/global-methods';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  initialQuery: string;

  searchForm = new FormGroup({
    query: new FormControl('', Validators.required)
  });

  initialResults: InitialResults;

  constructor(private searchService: SearchService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('query') !== null) {
      this.initialQuery = queryParams.get('query');
      this.searchForm.setValue({
        query: this.initialQuery
      });
      this.fetchData(this.initialQuery);
    }
    
    GlobalMethods.setTwoPartTitle(GlobalConstants.SEARCH);
  }

  get searchField() { return this.searchForm.controls; }

  private fetchData(query: string) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {query: query}, queryParamsHandling: 'merge'});
    this.searchService.getInitialResults(query).subscribe(results => {
      this.initialResults = results;
      console.log(this.initialResults);
    });
  }

  submitSearch() {
    const query = this.searchField.query.value;
    this.fetchData(query);
  }

  /**
   * Calculates a work's approval rating.
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }
}
