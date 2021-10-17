import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { FormGroup, FormControl } from '@angular/forms';
import { isMobile } from '@dragonfish/shared/functions';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AlertsService } from '@dragonfish/client/alerts';
import { SearchKind, SearchMatch } from '@dragonfish/shared/models/search';
import { ContentModel, Genres, TagKind, WorkKind } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { AppQuery } from '@dragonfish/client/repository/app';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';
import { TAGS_ENABLED } from '@dragonfish/shared/constants/content-constants';

@Component({
    selector: 'dragonfish-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    kindOptions = SearchKind;
    categoryOptions = WorkKind;
    genreOptions = Genres;
    matchOptions = SearchMatch;
    tagsEnabled = TAGS_ENABLED;
    loading = false;

    currentQuery = '';
    currentSearchKind: SearchKind = null;
    currentAuthor = '';
    currentCategoryKey: string = null;
    currentGenreKeys: string[] = [];
    currentGenreSearchMatch: SearchMatch = null;
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
        genreSearchMatch: new FormControl(null),
    });
    mobileMode = false;
    showAdvancedOptions = false;

    constructor(
        private network: DragonfishNetworkService,
        public route: ActivatedRoute,
        private router: Router,
        private alerts: AlertsService,
        private appQuery: AppQuery,
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.SEARCH);

        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe();

        const queryParams = this.route.snapshot.queryParamMap;

        this.currentQuery = queryParams.get('query');
        this.currentSearchKind = this.parseKind(queryParams.get('kind'));
        this.currentAuthor = queryParams.get('author');
        this.currentCategoryKey = this.parseCategoryKey(queryParams.get('category'));
        let genreListString = queryParams.get('genres');
        this.currentGenreKeys = genreListString ? this.parseGenreKeys(genreListString.split(',')) : [];
        this.currentGenreSearchMatch = this.parseMatch(queryParams.get('genreSearchMatch'));
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
            category: this.currentCategoryKey,
            genres: this.currentGenreKeys,
            genreSearchMatch: this.currentGenreSearchMatch,
        });

        if (queryParams.has('query')) {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategoryKey,
                this.currentGenreKeys,
                this.currentGenreSearchMatch,
                this.pageNum);
        }
        if (this.currentAuthor || this.currentCategoryKey != null ||
            (this.currentGenreKeys != null && this.currentGenreKeys.length > 0)) {
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
        this.currentCategoryKey = this.parseCategoryKey(this.searchForm.controls.category.value);
        this.currentGenreKeys = this.parseGenreKeys(this.searchForm.controls.genres.value);
        this.currentGenreSearchMatch = this.parseMatch(this.searchForm.controls.genreSearchMatch.value);
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
        const kind: SearchKind = SearchKind[kindString];
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kind : SearchKind.ProseAndPoetry;
    }

    /**
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * @param categoryString 
     * @returns 
     */
    private parseCategoryKey(categoryString: string): string {
        const category: WorkKind = WorkKind[categoryString];
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString : null;
    }

    /**
     * Genres are stored for works via their keys, so we want to return the keys instead of the values
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreStrings
     * @returns 
     */
    private parseGenreKeys(genreStrings: string[]): string[] {
        const genreList: string[] = [];
        if (genreStrings) {
            for (let genreString of genreStrings) {
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString);
                }
            }
        }

        return genreList;
    }

    private parseMatch(matchString: string): SearchMatch {
        const match: SearchMatch = SearchMatch[matchString];
        console.log("parseMatch " + matchString + " parsed as " + match);
        return Object.values(SearchMatch).indexOf(match) >= 0 ? match : SearchMatch.All;
    }

    private navigate() {
        let notUserSearch = this.currentSearchKind != SearchKind.User;
        let genresSearch = this.currentGenreKeys != null && this.currentGenreKeys.length > 0;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                query: this.currentQuery,
                kind: this.currentSearchKind != SearchKind.ProseAndPoetry ? this.currentSearchKind : null,
                author: (this.currentAuthor && notUserSearch) ? this.currentAuthor : null,
                category: (this.currentCategoryKey != null && notUserSearch) ? this.currentCategoryKey : null,
                genres: (genresSearch && notUserSearch) ? this.currentGenreKeys.toString() : null,
                genreSearchMatch: (genresSearch && notUserSearch && this.currentGenreSearchMatch != SearchMatch.All) ?
                    this.currentGenreSearchMatch : null,
                page: this.pageNum != 1 ? this.pageNum : null,
            },
        }).catch(() => {
            this.alerts.error(`Something went wrong! Try again in a little bit.`);
        }).then(() => {
            this.fetchData(
                this.currentQuery,
                this.currentSearchKind,
                this.currentAuthor,
                this.currentCategoryKey,
                this.currentGenreKeys,
                this.currentGenreSearchMatch,
                this.pageNum
            );
        });
    }

    private fetchData(
        query: string,
        searchKind: SearchKind,
        author: string | null,
        searchCategory: string | null,
        genres: string[] | null,
        genreSearchMatch: SearchMatch,
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
                    genreSearchMatch,
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
                    genreSearchMatch,
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
                    genreSearchMatch,
                    pageNum,
                    this.appQuery.filter,
                ).subscribe((results) => {
                    this.searchResultWorks = results;
                    this.loading = false;
                });
        }
    }
}
