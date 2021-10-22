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
    @Input() size: 'small' | 'large' = 'large';

    types = ContentKind;
    categories = WorkKind;
    kinds = TagKind;
    genres = Genres;

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
                if (this.category === WorkKind.Original) {
                    return 'Original';
                } else {
                    return 'Fanwork';
                }
            }
            case TagKind.Genre: {
                switch (Genres[this.genre]) {
                    case Genres.Comedy:
                        return 'Comedy';
                    case Genres.Drama:
                        return 'Drama';
                    case Genres.Erotica:
                        return 'Erotica';
                    case Genres.Fantasy:
                        return 'Fantasy';
                    case Genres.Horror:
                        return 'Horror';
                    case Genres.Mystery:
                        return 'Mystery';
                    case Genres.Romance:
                        return 'Romance';
                    case Genres.Thriller:
                        return 'Thriller';
                    case Genres.Tragedy:
                        return 'Tragedy';
                    case Genres.ActionAdventure:
                        return 'Action/Adventure';
                    case Genres.ScienceFiction:
                        return 'Science Fiction';
                    case Genres.SliceOfLife:
                        return 'Slice of Life';
                    case Genres.SpeculativeFiction:
                        return 'Speculative Fiction';
                }
            }
        }
    }
}
