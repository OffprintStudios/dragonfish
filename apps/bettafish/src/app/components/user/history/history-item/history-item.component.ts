import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { slugify } from 'voca';
import { UserInfo } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-history-item',
    templateUrl: './history-item.component.html',
    styleUrls: ['./history-item.component.scss'],
})
export class HistoryItemComponent {
    @Input() document: ReadingHistory;
    @Output() onSelect = new EventEmitter<string>();
    @Output() onDeselect = new EventEmitter<string>();
    selected = false;
    contentKind = ContentKind;

    selectItem() {
        this.selected = true;
        this.onSelect.emit(this.document._id);
    }

    deselectItem() {
        this.selected = false;
        this.onDeselect.emit(this.document._id);
    }

    goToItem() {
        const content = this.document.content as ContentModel;
        const contentAuthor = content.author as UserInfo;
        switch (content.kind) {
            case ContentKind.NewsContent:
                return ['/news', content._id, slugify(content.title)];
            case ContentKind.BlogContent:
                return ['/portfolio', contentAuthor._id, slugify(contentAuthor.username), 'blog', content._id, slugify(content.title)];
            case ContentKind.ProseContent:
                return ['/prose', content._id, slugify(content.title)];
            case ContentKind.PoetryContent:
                return ['/poetry', content._id, slugify(content.title)];
        }
    }
}
