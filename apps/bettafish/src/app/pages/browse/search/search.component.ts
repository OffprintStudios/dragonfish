import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InitialResults } from '@dragonfish/shared/models/util';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormGroup, FormControl } from '@angular/forms';
import { isMobile } from '@dragonfish/shared/functions';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    loading = false;
    searchResults: InitialResults;
    searchForm = new FormGroup({
        query: new FormControl('')
    });
    mobileMode = false;

    constructor(
        private network: DragonfishNetworkService,
        public route: ActivatedRoute,
        private router: Router,
        private alerts: AlertsService,
    ) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.SEARCH);
        const queryParams = this.route.snapshot.queryParamMap;
        if (queryParams.has('query')) {
            const query = queryParams.get('query');
            this.fetchData(query);
        }
        this.onResize();
    }

    private fetchData(query: string) {
        this.loading = true;
        this.network.searchInitialResults(query).subscribe((results) => {
            this.searchResults = results;
            this.loading = false;
        });
    }
    
    submitSearch() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: this.searchForm.controls.query.value },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        });

        this.fetchData(this.searchForm.controls.query.value);
    }
    
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
