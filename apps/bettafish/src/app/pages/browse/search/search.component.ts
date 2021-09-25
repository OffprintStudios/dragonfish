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
    kindOptions = SearchKind;
    loading = false;
    pageNum = 1;
    currentSearchKind = SearchKind.ProseAndPoetry;
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

            this.currentSearchKind = this.parseKind(queryParams.get('kind'));
            this.searchForm.setValue({
                query: query,
                kind: this.currentSearchKind,
            });
            
            if (queryParams.has('page')) {
                this.pageNum = +queryParams.get('page');
            }
            else {
                this.pageNum = 1;
            }

            this.fetchData(query, this.currentSearchKind, this.pageNum);
        } else {
            this.searchForm.setValue({
                query: '',
                kind: this.currentSearchKind,
            })
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
        this.currentSearchKind = this.parseKind(this.searchForm.controls.kind.value);
        this.pageNum = 1;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.searchForm.controls.query.value,
                kind: this.currentSearchKind,
                page: this.pageNum,
            },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        }).then(() => {
            this.fetchData(this.searchForm.controls.query.value, this.currentSearchKind, this.pageNum);
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
                kind: this.currentSearchKind,
                page: event,
            },
            queryParamsHandling: 'merge',
        }).then(() => {
            this.fetchData(this.searchForm.controls.query.value, this.currentSearchKind, event);
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

    private parseKind(kindString: string): SearchKind {
        const kind: SearchKind = kindString as SearchKind;
        return Object.values(SearchKind).indexOf(kind) >= 0? kind : SearchKind.ProseAndPoetry;
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
