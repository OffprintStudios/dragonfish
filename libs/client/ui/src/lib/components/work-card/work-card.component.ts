import { Component, Input } from '@angular/core';
import { ContentKind, Genres } from '@dragonfish/shared/models/content';

import { calculateApprovalRating } from '@dragonfish/shared/functions';
import { slugify } from 'voca';

@Component({
    selector: 'dragonfish-work-card',
    templateUrl: './work-card.component.html',
    styleUrls: ['./work-card.component.scss'],
})
export class WorkCardComponent {
    @Input() content;
    @Input() showAuthor: boolean;
    @Input() size: 'small' | 'large';

    contentKind = ContentKind;
    contentGenres = Genres;

    showAllTags = false;

    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }

    toggleShowAllTags() {
        this.showAllTags = !this.showAllTags;
    }

    createContentUrl(kind: ContentKind, id: string, title: string) {
        if (kind === ContentKind.ProseContent) {
            return ['/prose', id, slugify(title)];
        } else if (kind === ContentKind.PoetryContent) {
            return ['/poetry', id, slugify(title)];
        }
    }
}
