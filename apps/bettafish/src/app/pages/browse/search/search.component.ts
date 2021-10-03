import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormGroup, FormControl } from '@angular/forms';
import { isMobile } from '@dragonfish/shared/functions';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AlertsService } from '@dragonfish/client/alerts';
import { SearchCategory, SearchKind } from '@dragonfish/shared/models/search';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    kindOptions = SearchKind;
    categoryOptions = SearchCategory;
    loading = false;

    currentQuery = '';
    currentSearchKind = SearchKind.ProseAndPoetry;
    currentAuthor = '';
    currentCategory = SearchCategory.Any;
    pageNum = 1;

    searchResultWorks: PaginateResult<ContentModel>;
    searchResultBlogs: PaginateResult<ContentModel>;
    searchResultNews: PaginateResult<ContentModel>;
    searchResultUsers: PaginateResult<Pseudonym>;
    searchForm = new FormGroup({
        query: new FormControl(''),
        kind: new FormControl(null),
        author: new FormControl(''),
        category: new FormControl(null),
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

        this.currentQuery = queryParams.get('query');
        this.currentSearchKind = this.parseKind(queryParams.get('kind'));
        this.currentAuthor = queryParams.get('author');
        this.currentCategory = this.parseCategory(queryParams.get('category'));
        if (queryParams.has('page')) {
            this.pageNum = +queryParams.get('page');
        }
        else {
            this.pageNum = 1;
        }

        this.searchForm.setValue({
            query: this.currentQuery,
            kind: this.currentSearchKind,
            author: this.currentAuthor,
            category: this.currentCategory,
        });

        if (this.currentQuery) {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategory,
                this.pageNum);
        }
        if (this.currentAuthor || this.currentCategory != SearchCategory.Any) {
            this.showAdvancedOptions = true;
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
        this.currentQuery = this.searchForm.controls.query.value;
        this.currentSearchKind = this.parseKind(this.searchForm.controls.kind.value);
        this.currentAuthor = this.searchForm.controls.author.value;
        this.currentCategory = this.parseCategory(this.searchForm.controls.category.value);
        this.pageNum = 1;

        if (this.currentQuery) {
            this.navigate()
        }
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
     onPageChange(event: number) {
        this.pageNum = event;
        this.navigate();
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
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kind : SearchKind.ProseAndPoetry;
    }

    private parseCategory(categoryString: string): SearchCategory {
        const category: SearchCategory = categoryString as SearchCategory;
        return Object.values(SearchCategory).indexOf(category) >= 0 ? category : SearchCategory.Any;
    }

    private navigate() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.currentQuery,
                kind: this.currentSearchKind != SearchKind.ProseAndPoetry ? this.currentSearchKind : null,
                author: this.currentAuthor ? this.currentAuthor : null,
                category: this.currentCategory != SearchCategory.Any ? this.currentCategory : null,
                page: this.pageNum != 1 ? this.pageNum : null,
            },
            queryParamsHandling: 'merge',
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        }).then(() => {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategory,
                this.pageNum
            );
        });
    }

    private fetchData(
        query: string,
        searchKind: SearchKind,
        author: string,
        searchCategory: SearchCategory,
        pageNum: number
        ) {
        this.loading = true;
        this.clearResults();
        switch(searchKind) {
            case SearchKind.Blog:
                this.network.findRelatedContent(
                    query,
                    searchKind,
                    author,
                    searchCategory,
                    pageNum
                ).subscribe((results) => {
                    this.searchResultBlogs = results;
                    this.loading = false;
                })
                break;
            case SearchKind.News:
                this.network.findRelatedContent(
                    query,
                    searchKind,
                    author,
                    searchCategory,
                    pageNum
                ).subscribe((results) => {
                    this.searchResultNews = results;
                    this.loading = false;
                });
                break;
            case SearchKind.User:
                this.network.searchUsers(query, pageNum).subscribe((results) => {
                    this.searchResultUsers = results;
                    this.loading = false;
                });
                break;
            case SearchKind.Poetry:
            case SearchKind.ProseAndPoetry:
            case SearchKind.Prose:
            default:
                this.network.findRelatedContent(
                    query,
                    searchKind,
                    author,
                    searchCategory,
                    pageNum
                ).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
        }
    }
}
