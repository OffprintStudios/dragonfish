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

    @Output() toPublish = new EventEmitter<BlogsContentModel>();
    @Output() toUnpublish = new EventEmitter<BlogsContentModel>();
    @Output() toDelete = new EventEmitter<string>();

    contentKind = ContentKind;
    editMenuOpened = false;

    toggleMenu() {
        this.editMenuOpened = !this.editMenuOpened;
    }

    publishBlog() {
        this.toPublish.emit(this.blog);
    }

    unpublishBlog() {
        this.toUnpublish.emit(this.blog);
    }

    deleteBlog() {
        this.toDelete.emit(this.blog._id);
    }
}
