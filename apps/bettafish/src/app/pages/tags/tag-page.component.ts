import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TagsQuery, TagsService } from "@dragonfish/client/repository/tags";
import { DragonfishNetworkService } from "@dragonfish/client/services";
import { setTwoPartTitle } from "@dragonfish/shared/constants";
import { htmlDecode } from "@dragonfish/shared/functions";
import { ContentModel, TagsModel } from "@dragonfish/shared/models/content";
import { PaginateResult } from "@dragonfish/shared/models/util";

@Component({
    selector: 'dragonfish-tag-page',
    templateUrl: './tag-page.component.html',
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
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.tagId = params.get("tagId");
            console.log(params.keys);
            //TODO: Not detecting page
            if (params.has('page')) {
                this.pageNum = +params.get('page');
            }
            this.fetchData(this.tagId, this.pageNum);
        });
    }

    private fetchData(tagId: string, pageNum: number): void {
        this.tagsService.fetchDescendants(tagId).subscribe((tagsTree) => {
            if (tagsTree.parent) {
                setTwoPartTitle(htmlDecode((tagsTree.parent as TagsModel).name + " — " + tagsTree.name));
            }
            else {
                setTwoPartTitle(htmlDecode(tagsTree.name));
            }
        });
        this.network.searchFandomTagContent(tagId, pageNum).subscribe((results) => {
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
