import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';
import { TagKind } from '@dragonfish/shared/models/content';
import { AlphabeticalTags } from './alphabetical-tags.component';

@UntilDestroy()
@Component({
    selector: 'dragonfish-fandom-tags',
    templateUrl: './fandom-tags.component.html',
    styleUrls: ['./fandom-tags.component.scss'],
})
export class FandomTagsComponent implements OnInit {
    alphabeticalTags: AlphabeticalTags[] = [];
    constructor(
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) { }

    ngOnInit(): void {
        setTwoPartTitle(Constants.FANDOM_TAGS);

        // Assumes alphabetical sorting for tags
        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe((tags) => {
            let savedLetter: string;
            let currentAlphaTags: AlphabeticalTags;
            for (const tag of tags) {
                // If first letter doesn't match saved letter, save letter and move to new section
                // Then either way, add to that letter's array
                if (savedLetter !== tag.name[0]) {
                    if (currentAlphaTags) {
                        this.alphabeticalTags.push(currentAlphaTags);
                    }
                    savedLetter = tag.name[0];
                    currentAlphaTags = new AlphabeticalTags(tag.name[0]);
                }
                currentAlphaTags.tags.push(tag);
            }
            // Add last set
            if (currentAlphaTags) {
                this.alphabeticalTags.push(currentAlphaTags);
            }
        });
    }

}
