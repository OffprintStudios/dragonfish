import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Genres, TagKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-tag-badge',
    templateUrl: './tag-badge.component.html',
    styleUrls: ['./tag-badge.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TagBadgeComponent {
    @Input() kind: TagKind;
    @Input() genre: Genres;

    kinds = TagKind;
    genres = Genres;
}
