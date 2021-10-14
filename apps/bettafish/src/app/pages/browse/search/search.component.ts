import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormGroup, FormControl } from '@angular/forms';
import { isMobile } from '@dragonfish/shared/functions';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AlertsService } from '@dragonfish/client/alerts';
import { SearchKind } from '@dragonfish/shared/models/search';
import { ContentModel, Genres, WorkKind } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { AppQuery } from '@dragonfish/client/repository/app';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    kindOptions = SearchKind;
    categoryOptions = WorkKind;
    genreOptions = Genres;
    loading = false;

    currentQuery = '';
    currentSearchKind = SearchKind.ProseAndPoetry;
    currentAuthor = '';
    currentCategory: WorkKind = null;
    currentGenres: Genres[] = [];
    currentGenreSearchAny = false;
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
        genres: new FormControl([]),
        genreSearchAny: new FormControl(false),
    });
    mobileMode = false;
    showAdvancedOptions = false;

    constructor(
        private network: DragonfishNetworkService,
        public route: ActivatedRoute,
        private router: Router,
        private alerts: AlertsService,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.SEARCH);
        const queryParams = this.route.snapshot.queryParamMap;

        this.currentQuery = queryParams.get('query');
        this.currentSearchKind = this.parseKind(queryParams.get('kind'));
        this.currentAuthor = queryParams.get('author');
        this.currentCategory = this.parseCategory(queryParams.get('category'));
        let genreListString = queryParams.get('genres');
        this.currentGenres = genreListString ? this.parseGenres(genreListString.split(',')) : [];
        this.currentGenreSearchAny = queryParams.get('genreSearchAny') === 'true';
        if (queryParams.has('page')) {
            this.pageNum = +queryParams.get('page');
        }
        else {
            this.pageNum = 1;
        }

        this.searchForm.setValue({
            query: (this.currentQuery || ''),
            kind: this.currentSearchKind,
            author: this.currentAuthor,
            category: this.currentCategory,
            genres: this.currentGenres,
            genreSearchAny: this.currentGenreSearchAny,
        });

        if (queryParams.has('query')) {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategory,
                this.currentGenres,
                this.currentGenreSearchAny,
                this.pageNum);
        }
        if (this.currentAuthor || this.currentCategory != null ||
            (this.currentGenres != null && this.currentGenres.length > 0)) {
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
        this.currentGenres = this.parseGenres(this.searchForm.controls.genres.value);
        this.currentGenreSearchAny = this.searchForm.controls.genreSearchAny.value;
        this.pageNum = 1;

        this.navigate();
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

    /**
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * Since no category names have spaces, there is no difference, but this is future proofing
     * @param categoryString 
     * @returns 
     */
    private parseCategory(categoryString: string): WorkKind {
        const category: WorkKind = WorkKind[categoryString];
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString as WorkKind : null;
    }

    /**
     * Genres are stored for works via their keys, so we want to return the key instead of the value
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreStrings
     * @returns 
     */
    private parseGenres(genreStrings: string[]): Genres[] {
        const genreList: Genres[] = [];
        if (genreStrings) {
            for (let genreString of genreStrings) {
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString as Genres);
                }
            }
        }

        return genreList;
    }

    private navigate() {
        let notUserSearch = this.currentSearchKind != SearchKind.User;
        let genresSearch = this.currentGenres != null && this.currentGenres.length > 0;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.currentQuery,
                kind: this.currentSearchKind != SearchKind.ProseAndPoetry ? this.currentSearchKind : null,
                author: (this.currentAuthor && notUserSearch) ? this.currentAuthor : null,
                category: (this.currentCategory != null && notUserSearch) ? this.currentCategory : null,
                genres: (genresSearch && notUserSearch) ? this.currentGenres.toString() : null,
                genreSearchAny: (genresSearch && notUserSearch && this.currentGenreSearchAny) ? true : null,
                page: this.pageNum != 1 ? this.pageNum : null,
            },
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        }).then(() => {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategory,
                this.currentGenres,
                this.currentGenreSearchAny,
                this.pageNum
            );
        });
    }

    private fetchData(
        query: string,
        searchKind: SearchKind,
        author: string | null,
        searchCategory: WorkKind | null,
        genres: Genres[] | null,
        genreSearchAny: boolean,
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
                    genres,
                    genreSearchAny,
                    pageNum,
                    this.appQuery.filter,
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
                    genres,
                    genreSearchAny,
                    pageNum,
                    this.appQuery.filter,
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
                    genres,
                    genreSearchAny,
                    pageNum,
                    this.appQuery.filter,
                ).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
        }
    }
}
