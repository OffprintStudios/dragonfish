import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TagsQuery, TagsService } from "@dragonfish/client/repository/tags";

@Component({
    selector: 'dragonfish-tag-page',
    templateUrl: './tag-page.component.html',
})
export class TagPageComponent implements OnInit {
    tagId = "";
    tagName = "";

    constructor(
        public route: ActivatedRoute,
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.tagId = params.get("tagId");
            this.tagsService.fetchDescendants(this.tagId).subscribe();
        });
    }
}