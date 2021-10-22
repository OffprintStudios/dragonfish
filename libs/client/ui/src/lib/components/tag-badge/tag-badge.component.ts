import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentKind, ContentRating, Genres, TagKind, WorkKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-tag-badge',
    templateUrl: './tag-badge.component.html',
    styleUrls: ['./tag-badge.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TagBadgeComponent implements OnInit {
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

    /* Ratings */
    ratings = ContentRating;
    isEveryone = false;
    isTeen = false;
    isMature = false;
    isExplicit = false;

    ngOnInit(): void {
        if (this.kind === TagKind.Rating) {
            if (this.rating === ContentRating.Everyone) {
                this.isEveryone = true;
                this.isTeen = false;
                this.isMature = false;
                this.isExplicit = false;
            } else if (this.rating === ContentRating.Teen) {
                this.isEveryone = false;
                this.isTeen = true;
                this.isMature = false;
                this.isExplicit = false;
            } else if (this.rating === ContentRating.Mature) {
                this.isEveryone = false;
                this.isTeen = false;
                this.isMature = true;
                this.isExplicit = false;
            } else if (this.rating === ContentRating.Explicit) {
                this.isEveryone = false;
                this.isTeen = false;
                this.isMature = false;
                this.isExplicit = true;
            } else {
                this.isEveryone = false;
                this.isTeen = false;
                this.isMature = false;
                this.isExplicit = false;
            }
        } else {
            this.isEveryone = false;
            this.isTeen = false;
            this.isMature = false;
            this.isExplicit = false;
        }
    }

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
                break;
            }
            case TagKind.Rating: {
                if (this.rating === ContentRating.Everyone) {
                    return 'Everyone';
                } else if (this.rating === ContentRating.Teen) {
                    return 'Teen';
                } else if (this.rating === ContentRating.Mature) {
                    return 'Mature';
                } else if (this.rating === ContentRating.Explicit) {
                    return 'Explicit';
                }
            }
        }
    }
}
