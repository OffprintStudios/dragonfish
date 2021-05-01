import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InitialResults } from '@dragonfish/shared/models/util';
import { NetworkService } from '../../../services';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    loading = false;
    searchResults: InitialResults;

    constructor(private network: NetworkService, public route: ActivatedRoute) {}

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParamMap;
        if (queryParams.has('query')) {
            const query = queryParams.get('query');
            this.fetchData(query);
        }
    }

    private fetchData(query: string) {
        this.loading = true;
        this.network.searchInitialResults(query).subscribe((results) => {
            this.searchResults = results;
            this.loading = false;
        });
    }
}
