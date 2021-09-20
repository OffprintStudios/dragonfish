import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogsContentModel, ContentKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-blog-card',
    templateUrl: './blog-card.component.html',
    styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent {
    @Input() blog: BlogsContentModel;
    @Input() showAuthor: boolean;
    @Input() showEditMenu = false;

    @Output() toEdit = new EventEmitter<string>();
    @Output() toPublish = new EventEmitter<string>();
    @Output() toDelete = new EventEmitter<string>();

    contentKind = ContentKind;
    editMenuOpened = false;

    toggleMenu() {
        this.editMenuOpened = !this.editMenuOpened;
    }

    editBlog() {
        this.toEdit.emit(this.blog._id);
    }

    publishBlog() {
        this.toPublish.emit(this.blog._id);
    }

    deleteBlog() {
        this.toDelete.emit(this.blog._id);
    }
}
