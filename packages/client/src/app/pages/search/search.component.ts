import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchService } from '../../services/utility';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InitialResults } from '../../services/utility/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  searchForm = new FormGroup({
    query: new FormControl('', Validators.required)
  });

  initialResults: InitialResults;

  constructor(private searchService: SearchService, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  get searchField() { return this.searchForm.controls; }

  private fetchData(query: string) {
    this.searchService.getInitialResults(query).subscribe(results => {
      this.initialResults = results;
    });
  }

  submitSearch() {
    const query = this.searchField.query.value;
    this.fetchData(query);
  }
}
