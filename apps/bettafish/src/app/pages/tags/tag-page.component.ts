import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppQuery } from "@dragonfish/client/repository/app";
import { TagsQuery, TagsService } from "@dragonfish/client/repository/tags";
import { DragonfishNetworkService } from "@dragonfish/client/services";
import { setTwoPartTitle } from "@dragonfish/shared/constants";
import { htmlDecode } from "@dragonfish/shared/functions";
import { ContentModel, TagsModel } from "@dragonfish/shared/models/content";
import { PaginateResult } from "@dragonfish/shared/models/util";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { combineLatest } from "rxjs";

@UntilDestroy()
@Component({
    selector: 'dragonfish-tag-page',
    templateUrl: './tag-page.component.html',
    styleUrls: ['./tag-page.component.scss'],
})
export class TagPageComponent implements OnInit {
    tagId = "";
    tagName = "";
    pageNum = 1;
    searchResults: PaginateResult<ContentModel>;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
        private network: DragonfishNetworkService,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        combineLatest([this.route.paramMap, this.route.queryParamMap])
            .pipe(untilDestroyed(this))
            .subscribe((value) => {
                const [params, queryParams] = value;
                if (queryParams.has('page')) {
                    this.pageNum = +queryParams.get('page');
                }
                else {
                    this.pageNum = 1;
                }
                this.fetchData(params.get("tagId"), this.pageNum);
            });
    }

    private fetchData(tagId: string, pageNum: number): void {
        if (this.tagId != tagId) {
            this.tagId = tagId;
            this.tagsService.fetchDescendants(tagId).subscribe((tagsTree) => {
                if (tagsTree.parent) {
                    setTwoPartTitle(htmlDecode((tagsTree.parent as TagsModel).name + " — " + tagsTree.name));
                }
                else {
                    setTwoPartTitle(htmlDecode(tagsTree.name));
                }
            });
        }
        
        this.network.getContentByFandomTag(tagId, pageNum, this.appQuery.filter).subscribe((results) => {
            this.searchResults = results;
        })
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
     onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        }).then(() => {
            this.fetchData(this.tagId, event);
        });
        this.pageNum = event;
    }
}
