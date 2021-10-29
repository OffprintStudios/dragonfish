import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentKind, ContentRating, Genres, TagKind, WorkKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-tag-badge',
    templateUrl: './tag-badge.component.html',
    styleUrls: ['./tag-badge.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TagBadgeComponent {
    @Input() kind: TagKind;
    @Input() type: ContentKind;
    @Input() category: WorkKind;
    @Input() genre: Genres;
    @Input() rating: ContentRating;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() hasIcon = true;

    types = ContentKind;
    categories = WorkKind;
    kinds = TagKind;
    genres = Genres;
    ratings = ContentRating;

    generateTooltip() {
        switch (this.kind) {
            case TagKind.Type: {
                if (this.type === ContentKind.ProseContent) {
                    return 'Prose';
                } else {
                    return 'Poetry';
                }
            }
            case TagKind.Category: {
                return WorkKind[this.category];
            }
            case TagKind.Genre: {
                return Genres[this.genre];
            }
            case TagKind.Rating: {
                return ContentRating[this.rating];
            }
        }
    }
}
