import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InitialResults, PaginateResult } from '@dragonfish/shared/models/util';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormGroup, FormControl } from '@angular/forms';
import { isMobile } from '@dragonfish/shared/functions';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AlertsService } from '@dragonfish/client/alerts';
import { SearchKind } from '@dragonfish/shared/models/search';
import { ContentModel } from '@dragonfish/shared/models/content';
import { User } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    loading = false;
    pageNum = 1;
    searchResultWorks: PaginateResult<ContentModel>;
    searchResultBlogs: PaginateResult<ContentModel>;
    searchResultNews: PaginateResult<ContentModel>;
    searchResultUsers: PaginateResult<User>;
    searchForm = new FormGroup({
        query: new FormControl(''),
        kind: new FormControl(null),
    });
    mobileMode = false;
    showAdvancedOptions = false;
    kindOptions = SearchKind;

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

            const kind: SearchKind | undefined = (<any>SearchKind)[queryParams.get('kind')];
            const searchKind: SearchKind = kind? kind : SearchKind.ProseAndPoetry;
            this.searchForm.setValue({
                query: query,
                kind: searchKind,
            });
            
            if (queryParams.has('page')) {
                this.pageNum = +queryParams.get('page');
            }
            else {
                this.pageNum = 1;
            }

            this.fetchData(query, searchKind, this.pageNum);
        }
        this.onResize();
    }

    private clearResults() {
        this.searchResultBlogs = null;
        this.searchResultNews = null;
        this.searchResultWorks = null;
        this.searchResultUsers = null;
    }
    
    submitSearch() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.searchForm.controls.query.value,
                kind: this.searchForm.controls.kind.value,
            },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        }).then(() => {
            this.fetchData(this.searchForm.controls.query.value, this.searchForm.controls.kind.value, 1);
        });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
     onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.searchForm.controls.query.value,
                kind: this.searchForm.controls.kind.value,
                page: event,
            },
            queryParamsHandling: 'merge',
        }).then(() => {
            this.fetchData(this.searchForm.controls.query.value, this.searchForm.controls.kind.value, event);
        });
        this.pageNum = event;
    }
    
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }

    toggleShowAdvancedOptions() {
        this.showAdvancedOptions = !this.showAdvancedOptions;
    }

    private fetchData(query: string, searchKind: SearchKind, pageNum: number) {
        this.loading = true;
        this.clearResults();
        switch(searchKind) {
            case SearchKind.Blog:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultBlogs = results;
                    this.loading = false;
                })
                break;
            case SearchKind.News:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultNews = results;
                    this.loading = false;
                });
                break;
            case SearchKind.Poetry:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
                break;
            case SearchKind.ProseAndPoetry:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
                break;
            case SearchKind.Prose:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
                break;
            case SearchKind.User:
                this.network.searchUsers(query, pageNum).subscribe((results) => {
                    this.searchResultUsers = results;
                    this.loading = false;
                });
                break;
            default:
                this.network.findRelatedContent(query, searchKind, pageNum).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
        }
    }
}
