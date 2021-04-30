import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentKind } from '@dragonfish/shared/models/content';
import { ListKind } from '@dragonfish/shared/models/util';
import { calculateApprovalRating } from '@dragonfish/shared/functions';
import { slugify } from 'voca';

@Component({
    selector: 'dragonfish-content-list-item',
    templateUrl: './content-list-item.component.html',
    styleUrls: ['./content-list-item.component.scss']
})
export class ContentListItemComponent {
    @Input() item: any;
    @Input() listKind: ListKind;
    @Output() deleteItem = new EventEmitter<string>();

    kinds = ListKind;
    contentKind = ContentKind;

    /**
     * Calculates the approval rating.
     *
     * @param likes The likes on a work
     * @param dislikes The dislikes on a work
     */
    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }

    /**
     * Navigates to the selected content, specific to History.
     */
    navigateToContent(kind: ContentKind, id: string, title: string, userId: string, username: string) {
        switch (kind) {
            case ContentKind.PoetryContent:
                return ['/poetry', id, slugify(title)];
            case ContentKind.ProseContent:
                return ['/prose', id, slugify(title)];
            case ContentKind.NewsContent:
                return ['/news', id, slugify(title)];
            case ContentKind.BlogContent:
                return ['/portfolio', userId, slugify(username), 'post', id, slugify(title)];
        }
    }
}
