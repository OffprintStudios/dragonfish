import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { InitialResults } from '@dragonfish/models/util';

import { calculateApprovalRating } from '@dragonfish/utilities/functions';
import { Constants, Title } from '@dragonfish/utilities/constants';
import { NetworkService } from '../../services';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
    searchForm = new FormGroup({
        query: new FormControl('', Validators.required),
    });

    searchResults: InitialResults;

    constructor(private networkService: NetworkService, public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParamMap;
        if (queryParams.get('query') !== null) {
            const query = queryParams.get('query');
            this.searchForm.setValue({
                query: query,
            });
            this.fetchData(query);
        }

        Title.setTwoPartTitle(Constants.SEARCH);
    }

    get searchField() {
        return this.searchForm.controls;
    }

    private fetchData(query: string) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: query },
            queryParamsHandling: 'merge',
        });
        this.networkService.searchInitialResults(query).subscribe((results) => {
            this.searchResults = results;
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
