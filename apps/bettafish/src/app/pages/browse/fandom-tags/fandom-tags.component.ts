import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';
import { TagKind } from '@dragonfish/shared/models/content';

@UntilDestroy()
@Component({
    selector: 'dragonfish-fandom-tags',
    templateUrl: './fandom-tags.component.html',
    styleUrls: ['./fandom-tags.component.scss'],
})
export class FandomTagsComponent implements OnInit {
    constructor(
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) { }

    ngOnInit(): void {
        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe();

        setTwoPartTitle(Constants.FANDOM_TAGS);
    }
}
