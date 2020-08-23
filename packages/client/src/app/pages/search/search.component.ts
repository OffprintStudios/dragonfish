import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchService } from '../../services/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  searchForm = new FormGroup({
    query: new FormControl('', Validators.required)
  });

  constructor(private searchService: SearchService, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  get searchField() { return this.searchForm.controls; }

  submitSearch() {
    const query = this.searchField.query.value;
    console.log(query);

    /*this.searchService.getUsersFromQuery(query, 1, 10).subscribe(() => {
      return;
    })*/
  }
}
