import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogsContentModel, ContentKind } from '@dragonfish/shared/models/content';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { isAllowed } from '@dragonfish/shared/functions';
import { Roles } from '@dragonfish/shared/models/accounts';

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
    @Output() addToFeed = new EventEmitter<string>();
    @Output() removeFromFeed = new EventEmitter<string>();

    contentKind = ContentKind;
    editMenuOpened = false;

    constructor(private session: SessionQuery) {}

    toggleMenu() {
        this.editMenuOpened = !this.editMenuOpened;
    }

    publishBlog() {
        this.toPublish.emit(this.blog);
    }

    unpublishBlog() {
        this.toUnpublish.emit(this.blog);
    }

    emitAddToFeed() {
        this.addToFeed.emit(this.blog._id);
    }

    emitRemoveFromFeed() {
        this.removeFromFeed.emit(this.blog._id);
    }

    deleteBlog() {
        this.toDelete.emit(this.blog._id);
    }

    canSeeNewsPostButton() {
        if (this.session.currAccount) {
            return isAllowed(this.session.currAccount.roles, [Roles.Admin, Roles.Moderator, Roles.Contributor]);
        } else {
            return false;
        }
    }
}
