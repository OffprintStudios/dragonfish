import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentKind, Genres, TagKind, WorkKind } from '@dragonfish/shared/models/content';

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

    types = ContentKind;
    categories = WorkKind;
    kinds = TagKind;
    genres = Genres;
}
