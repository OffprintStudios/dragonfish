import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/content';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  testQueries() {
    const testQuery = `test query`;
    const testPage = 1;

    this.searchService.testQueries(testQuery, testPage).subscribe(() => {
      console.log(`Success!`);
    }, () => {
      console.log(`Failure!`);
    });
  }
}
