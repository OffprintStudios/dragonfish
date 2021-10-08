import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentForm, CommentKind } from '@dragonfish/shared/models/comments';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { AlertsService } from '@dragonfish/client/alerts';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
    @Input() itemId!: string; // The ID of the content
    @Input() kind!: CommentKind; // The kind of comments thread it is, between all content
    @Input() pageNum!: number; // The requested page number
    @Output() emitPageChange = new EventEmitter<number>(); // Emits the current page number

    newCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(
        public contentQuery: ContentViewQuery,
        public sessionQuery: SessionQuery,
        private contentService: ContentViewService,
        private alerts: AlertsService,
    ) {}

    /**
     * Getter for the new comment form
     */
    private get newCommentFields() {
        return this.newCommentForm.controls;
    }

    /**
     * Creates a new comment
     */
    submitNewComment() {
        if (this.newCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const formData: CommentForm = {
            body: this.newCommentFields.body.value,
            repliesTo: [],
        };

        /*this.contentService.addComment(this.itemId, formData).subscribe(() => {
            this.newCommentForm.reset();
        });*/
    }
}
